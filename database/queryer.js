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
     * purges all values from the table, resets any counters, and cascades into linked tables TESTING ONLY
     * @returns nothing
     */
    destroy() {
        const query = '\
        TRUNCATE $1:name\
        RESTART IDENTITY\
        CASCADE;';
        return db.none(query, this.table);
    }
    /**
     * adds a value to a row in a column that houses an array
     * @param {any} value - the value to add to the array
     * @param {string} column - the column contating the array
     * @param {string} rowIdentifier - the column used to identify the row being altered
     * @param {any} idValue - the value used to identify the specific row
     * @returns nothing
     */
    appendToArray(value, column, rowIdentifier, idValue) {
        const query = '\
        UPDATE $1:name\
        SET $2:name = array_append($2:name, $3:value)\
        WHERE $4:name = $5;';
        return db.none(query, [this.table, column, value, rowIdentifier, idValue]);
    }
    /**
     * returns an array of values from the specified columns
     * @param {string|array} column - the column or columns you wish to receive
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
     * adds a new row to the table, in line with the columns provided in the constructor
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
     * works the same as addRow, but returns the id of the row inserted
     * @param {array} values 
     * @returns an object containing property id
     */
    addRowReturning(values) {
        const query = '\
        INSERT INTO $1:name ($2:value)\
        VALUES($3:csv)\
        RETURNING id;';
        return db.one(query, [this.table, this.columns.names, values]);
    }
    /**
     * updates a row identified with the identifier and idValue in the specified column with the data provided
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
    /**
     * deletes a row from the table, as specified by the identifier and idValue
     * @param {string} identifier - the column used to identify the row to remove
     * @param {any} idValue - the value in the column in the row which you wish to delete
     * @returns an empty promise
     */
    deleteRow(identifier, idValue) {
        const query = '\
        DELETE FROM $1:name\
        WHERE $2:name = $3;';
        return db.none(query, [this.table, identifier, idValue])
    }
    /**
     * returns an array of values ordered by attribute, limited to the specified numbeer of entries
     * @param {string} column 
     * @param {any} orderAttribute 
     * @param {number} limit 
     * @returns an array of result ordered by the specified attribute
     */
    orderedQuery(column, orderAttribute, limit) {
        const query = '\
        SELECT $1:value\
        FROM $2:name\
        ORDER BY $3:name\
        LIMIT $4;';
        return db.any(query, [column, this.table, orderAttribute, limit])
    }
    /**
     * returns an array of posts the size specified, starting at the id specified, order by what is specified
     * @param {string} column 
     * @param {number} beginId 
     * @param {number} chunkSize 
     * @param {string} orderBy
     * @returns a slice of the table starting at {beginId} with a length of {chunkSize}
     */
    chunkedQuery(column, beginId, chunkSize, orderBy) {
        const query = '\
        SELECT $1:name\
        FROM $2:name\
        ORDER BY $5:value\
        LIMIT $3:value\
        OFFSET $4:value;'
        return db.any(query, [column, this.table, beginId, (beginId + chunkSize), orderBy]);
    }
    chunkedQueryWhere(column, beginId, chunkSize, orderBy, columnWhere, value) {
        const query = '\
        SELECT $1:name\
        FROM $2:name\
        WHERE $6:name = $7:value\
        ORDER BY $5:value\
        LIMIT $3:value\
        OFFSET $4:value;'
        return db.any(query, [column, this.table, beginId, (beginId + chunkSize), orderBy, columnWhere, value]);
    }
    /**
     * increments the value in a row for the specified column by the specified amount
     * @param {string} column 
     * @param {number} amount 
     * @param {string} identifier 
     * @param {any} idValue 
     * @returns nothing
     */
    incrementValue(column, amount, identifier, idValue) {
        const query = '\
        UPDATE $1:name\
        SET $2:name = $2:name + $3:value\
        WHERE $4:name = $5;';
        return db.none(query, [this.table, column, amount, identifier, idValue]);
    }
    /**
     * decrements the value in a row for the specified column by the specified amount
     * @param {string} column 
     * @param {number} amount 
     * @param {string} identifier 
     * @param {any} idValue 
     * @returns nothing
     */
    decrementValue(column, amount, identifier, idValue) {
        const query = '\
        UPDATE $1:name\
        SET $2:name = $2:name - $3:value\
        WHERE $4:name = $5;';
        return db.none(query, [this.table, column, amount, identifier, idValue]);
    }
    /**
     * 
     * @param {*} func 
     * @param {*} column 
     * @param {*} identifier 
     * @param {*} id_value 
     * @returns the specified aggregrate for the column
     */
    getAggregate(func, column, identifier, id_value) {
        const query = '\
        SELECT $1:value($2:value)\
        FROM $3:name\
        WHERE $4:name = $5;';
        return db.one(query, [func, column, this.table, identifier, id_value]);
    }
}

module.exports = Queryer;

