const { resolve } = require("path");
const { db } = require("../configs/db.js");
const axios = require("axios");
const { constants } = require("../configs/constants");
const moment = require("moment");
const os = require("os");
const fs = require("fs");
module.exports = {
  doQuery: async function (conn, sql, args) {
    return new Promise((resolve, reject) => {
      conn.query(sql, args, (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve({ results, fields });
        }
      });
    });
  },
  syncMenu: async function () {
    return await this.generateMenu();
  },
  syncSubmenu: async function (menuid) {
    return await this.generateSubmenu(menuid);
  },
  generateMenu: async function () {
    let query = `SELECT * FROM mst_menu WHERE Active = 1`;
    return (await this.doQuery(db, query)).results;
  },
  generateSubmenu: async function (menuid) {
    let query = `SELECT * FROM mst_submenu WHERE MenuID = ${menuid}`;
    return (await this.doQuery(db, query)).results;
  },
  getData: async function (url, data) {
    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  newData: async function (table, obj) {
    let keys = Object.keys(obj);
    let values = Object.values(obj);
    const formattedValues = values.map((value) =>
      typeof value === "string" ? `'${value}'` : value
    );

    let sql = `INSERT INTO ${table} (${keys.join(
      ","
    )}) VALUES (${formattedValues.join(",")})`;
    db.query(sql, (err, hasil) => {
      if (err) return err;
    });
    return true;
  },
  updateData: async function (table, obj, where) {
    let updateString = Object.entries(obj)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(", ");
    let conditions = Object.entries(where)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(", ");

    let sql = `UPDATE ${table} SET ${updateString} WHERE 1 AND ${conditions}`;
    db.query(sql, (err, hasil) => {
      if (err) return err;
    });
    return true;
  },
  log_update: async function (status, log, UserID) {
    let formattedDate = moment().utcOffset("+0700").format("DD-MM-YYYY");
    let formattedTime = moment().utcOffset("+0700").format("HH:mm:ss");
    let filePath =
      status == "success" ? constants.transactionPath : constants.errorPath;
    let path =
      status == "success"
        ? "logs/transactions/Transaction"
        : "logs/errors/Error";
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, (err) => {
        if (err) {
          return console.log(err);
        }
      });
    }
    if (!fs.existsSync(`${path} - ${formattedDate}.txt`)) {
      if (UserID) {
        fs.appendFileSync(
          `${path} - ${formattedDate}.txt`,
          `[${formattedTime}] ${log} 'UserID = ${UserID} '${os.EOL}`,
          "utf-8",
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
      } else {
        fs.appendFileSync(
          `${path} - ${formattedDate}.txt`,
          `[${formattedTime}] ${log} ${os.EOL}`,
          "utf-8",
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
      }
    } else {
      if (UserID) {
        fs.appendFileSync(
          `${path} - ${formattedDate}.txt`,
          `[${formattedTime}] ${log} 'UserID = ${UserID} '${os.EOL}`,
          "utf-8",
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
      } else {
        fs.appendFileSync(
          `${path} - ${formattedDate}.txt`,
          `[${formattedTime}] ${log} ${os.EOL}`,
          "utf-8",
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
      }
    }
  },
  generateTransactionID: async function (category, loyalty = "", type = "") {
    let counter;
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();
    let formattedMonth = currentMonth.toString().padStart(2, "0");
    let formattedYear = currentYear.toString();
    let loyaltyCodes = {
      Bronze: "BRZ",
      Silver: "SLV",
      Gold: "GLD",
      Platinum: "PLT",
      Diamond: "DMD",
    };
    let categoryCodes = {
      Top50: "TOP",
      TopSlot: "TOP-SLT",
      TopCasino: "TOP-CSN",
      TopWD: "TOP-WDR",
      WeeklyQuest: "WEK-QST",
      LevelUp: "LVL",
      Luckyspin: "LSP",
      Redeem: "RDM",
      Custom: "CTM-CRM",
      DailyLogin: "DLY-LOG",
      Gacha: "GCH",
      Reload: "RLD",
      WDCoin: "WTD-COI",
    };
    let postfixCode;
    if (category == "Luckyspin") {
      if (type == "Nominal") {
        postfixCode = "00";
      } else if (type == "Barang") {
        postfixCode = "01";
      }
    } else {
      postfixCode = "00";
    }
    let prefixCode =
      category === "TopSlot" ||
      category === "TopCasino" ||
      category === "TopWD" ||
      category === "WeeklyQuest" ||
      category === "Custom" ||
      category === "DailyLogin" ||
      category === "WDCoin"
        ? `${categoryCodes[category]}`
        : `${categoryCodes[category]}-${loyaltyCodes[loyalty]}`;
    let config = "";
    if (loyalty != "") {
      config = category + loyalty;
    } else {
      config = category;
    }
    let queryLastCounter = `SELECT * FROM systab WHERE Config = '${config}'`;
    let lastCounterResult = (await this.doQuery(db, queryLastCounter)).results;
    let queryCurrentMonth = `SELECT * FROM systab WHERE Config = 'CurrentMonth'`;
    let currentMonthResult = (await this.doQuery(db, queryCurrentMonth))
      .results;
    if (currentMonthResult[0].Value != currentMonth) {
      counter = 1;
      await this.doQuery(
        db,
        `UPDATE systab SET Value = '${currentMonth}' WHERE Config = 'CurrentMonth'`
      );
      await this.doQuery(
        db,
        `UPDATE systab SET Value = NULL WHERE Config <> 'CurrentMonth'`
      );
    } else {
      if (!lastCounterResult.length || lastCounterResult[0].Value == null) {
        counter = 1;
      } else {
        counter = parseInt(lastCounterResult[0].Value) + 1;
      }
    }
    await this.doQuery(
      db,
      `UPDATE systab SET Value = '${counter}' WHERE Config = '${config}'`
    );
    let formattedCounter = counter.toString().padStart(6, "0");
    let newTransactionID = `${formattedMonth}-${formattedYear}-${prefixCode}-${postfixCode}-${formattedCounter}`;
    return newTransactionID;
  },
};
