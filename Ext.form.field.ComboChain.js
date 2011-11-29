/**
 * @class Ext.form.field.ComboChain
 * @extends Ext.form.field.ComboBox
 * <p>An extension of the combo class which provides to chain and link combos in a form</p>
 * 
 * ## Example usage:
 *
 *     // Create the combo box, attached to the states data store, with Company as chain combo
 *     var comboState = {
 *		   xtype: 'combochain',
 *         fieldLabel: 'Choose State',
 *         name: 'State',
 *         store: states,
 *         queryMode: 'local',
 *         displayField: 'name',
 *         valueField: 'abbr',
 *         renderTo: Ext.getBody(),
 *         chains: [{name:'Company'}]
 *     };
 *
 *     // Create the combo box, attached to the company data store, with State as chained combo
 *     var comboCompany = {
 *		   xtype: 'combochain',
 *         fieldLabel: 'Choose Company',
 *         name: 'Company',
 *         store: company,
 *         queryMode: 'local',
 *         displayField: 'name',
 *         valueField: 'abbr',
 *         renderTo: Ext.getBody(),
 *         chained:[ {name:'State',key: 'StateId',value:'',required:true}]
 *     });
 * @docauthor Carlos Miranda <carlosgoias@hotmail.com>
 */
 
Ext.define('Ext.form.field.ComboChain', {
    	extend: 'Ext.form.field.ComboBox',  
	alias: 'widget.combochain',		
    	initComponent: function() {				       
		if(!this.checkIsReady())		
			this.setDisabled(true);	
			
		this.on({
			afterrender: this.setChains,
			select:	this.comboChainSelect,
		});
		
		this.callParent(arguments);				
    	},
    	clear: function()
	{				
		this.clearValue();
		this.getStore().clearData();
		this.lastQuery = null;		
		this.setDisabled(true);
	},
	setChains: function(){
		var me = this;				
		me.comboChainSelect(me);
	},
	checkIsReady: function()
	{
		me = this;		
		if(!me.chained)			
			return true;		
		
		var result = true;
		var chained = me.chained;
		
		Ext.Array.each(chained, function(chain) {			
			if((chain.value === '' || chain.value === undefined) && (chain.required))										
				result = false;				
		});	
		
		return result;
	},
	load: function()
	{		
		var store = this.getStore();	
		var me = this;
		me.setDisabled(false);										
		Ext.Array.each(me.chained, function(chained) {				 
			store.proxy.extraParams[chained.key] = chained.value;
		},me);				
		store.load();				
	},
	comboChainSelect: function(combo, record, options){			
		if(!combo.chains)
			return;
		
		var chains = combo.chains;				
		var painel = combo.up('form');						
		var form = painel.getForm();
		var uid = combo.getValue();
		
		Ext.Array.each(chains, function(chain) {			
			var comboChained = form.findField(chain.name);
			
			if(comboChained){			
				var chained = comboChained.chained;								
				
				Ext.Array.each(chained, function(chaind) {					
					if(combo.name==chaind.name)					
						chaind.value = uid;
				});		
				
				if(comboChained.checkIsReady())
					comboChained.load();
				else
					comboChained.clear();
			}	
		},this);
	},	
	chained: null,
	chains: null,
});
