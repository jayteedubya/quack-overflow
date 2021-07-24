const { pg, db } = require('./connect.js');

class Queryer {
    /**
     * constructor for a new queryer object
     * @param {string} table - the name of the table
     * @param {array} columns - an array of the tables columns, in the order listed in the docs. exclude any with default values
     */
    constructor(table, columns) {
        this.table = table
        this.columns = new pg.helpers.ColumnSet(columns)
    }
    /**
     * 
     * @param {string || array} column - the column or columns you wish to receive
     * @param {string} attribute - the attribute by which you wish to identify the row which you are querying
     * @param {any} value - the value of the attribute you wish to use to identify the row
     * @returns an object, keyed with the columns requested
     */
    getColumnFromAttribute(column, attribute, value) {
        const query = '\
        SELECT $1:value\
        FROM $2:name\
        WHERE $3:name = $4';
        return db.any(query, [column.toString(), this.table, attribute, value]);
    }
    /**
     * 
     * @param {array} values - a list of values appropriate to insert into this table
     * @returns an empty promise
     */
    addRow(values) {
        const query = '\
        INSERT INTO $1:name ($2:value)\
        VALUES($3:csv);';
        return db.none(query, [this.table, this.columns.names, values]);
    }
    /**
     * 
     * @param {string} column - the column name whose value you would like to change
     * @param {any} value - the value you are replacing the original value with
     * @param {string} identifier - the column which you are using to identify the row which is being changed
     * @param {any} idValue - the value you are using to identify the row which is being changed
     * @returns 
     */
    updateRow(column, value, identifier, idValue){
        const query = '\
        UPDATE $1:name\
        SET $2:name = $3\
        WHERE $4:name = $5;';
        return db.none(query, [this.table, column, value, identifier, idValue])
    }
    deleteRow(identifier, idValue) {
        const query = '\
        DELETE FROM $1:name\
        WHERE $2:name = $3;';
        return db.none(query, [this.table, identifier, idValue])
    }
}

module.exports = Queryer;

