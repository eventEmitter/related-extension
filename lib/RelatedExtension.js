(function() {
    'use strict';


	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
        , type          = require('ee-types')
        , EventEmitter  = require('ee-event-emitter');



	module.exports = new Class({
        inherits: EventEmitter

        , _modelListenerNames: ['beforeSave', 'afterSave', 'afterSaveCommit', 'beforeDelete', 'afterDelete', 'afterDeleteCommit', 'beforeInsert', 'afterInsert', 'beforeUpdate', 'afterUpdate', 'beforeSaveDependents', 'afterSaveDependents', 'beforeSaveBelongsTo', 'afterSaveBelongsTo', 'beforeSaveMappings', 'bafterSaveMappings', 'beforeSaveRefernces', 'afterSaveRefernces'].map(function(eventName){return {eventName: eventName, listenerName: 'on'+eventName[0].toUpperCase()+eventName.slice(1)};})
        , _resourceListenerNames: ['beforePrepare', 'afterPrepare', 'beforePrepareSubqueries', 'afterPrepareSubqueries'].map(function(eventName){return {eventName: eventName, listenerName: 'on'+eventName[0].toUpperCase()+eventName.slice(1)};})
        , _queryBuilderListenerNames: ['beforeFind', 'afterFind', 'beforeUpdate', 'afterUpdate', 'beforeDelete', 'afterDelete'].map(function(eventName){return {eventName: eventName, listenerName: 'on'+eventName[0].toUpperCase()+eventName.slice(1)};})


		, init: function() {
            Class.define(this, '_modelListeners', Class([]));
            Class.define(this, '_resourceListeners', Class([]));
            Class.define(this, '_queryBuilderListeners', Class([]));

            this._preapreListeners('model');
            this._preapreListeners('resource');
            this._preapreListeners('queryBuilder');

            // storage for filter / selector extensions
            this.filters = [];
            this.selectors = [];
        }





        , reloadEntity: function(dbName, entityName) {
            this.emit('reloadEntity', dbName, entityName);
        }





        /*
         * return the extensions identifier
         */
        , getName: function() {
            return this._name;
        }


        /*
         * prepares the lsiteners for a specific colelction
         */
        , _preapreListeners: function(name) {
            this['_'+name+'ListenerNames'].filter(function(config) {
                if (type.function(this[config.listenerName])) {
                    this['_'+name+'Listeners'].push({
                          event     : config.eventName
                        , listener  : this[config.listenerName].bind(this)
                    });
                }
            }.bind(this));
        }


        /*
         * return all names of event listners present for the model
         */
        , getModelEventListeners: function() {
            return this._modelListeners;
        }


        /*
         * return all names of event listners present for the query builder
         */
        , getQueryBuilderEventListeners: function() {
            return this._queryBuilderListeners;
        }


        /*
         * return all names of event listners present for the resource
         */
        , getResourceEventListeners: function() {
            return this._resourceListeners;
        }


        /*
         * sets some required variable son the extension
         * so it has access to them
         */
        , setVariables: function(options) {
            Object.keys(options).forEach(function(key) {
                this[key] = options[key];
            }.bind(this));
        }


        /**
         * give the extension access on the current orm
         * instance
         */
        , setOrm: function(orm) {
            this.orm = orm;
            this.ORM = orm.getORM();
        }



        /*
         * default: don't use on any model
         */
        , useOnModel: function(definition) {
            return false;
        }


        /*
         * identify myself as extension
         */
        , isRelatedExtension: function() {
            return true;
        }



        /**
         * tell the orm that we have some selectors to publish
         */
        , hasSelectorExtensions: function() {
            return this.selectors && this.selectors.length;
        }


        /**
         * tell the orm that we have some filters to publish
         */
        , hasFilterExtensions: function() {
            return this.filters && this.filters.length;
        }



        /**
         * returns the selector extensions
         */
        , getSelectorExtensions: function() {
            return this.selectors;
        }



        /**
         * returns the selector extensions
         */
        , getFilterExtensions: function() {
            return this.filters;
        }

	});
})();
