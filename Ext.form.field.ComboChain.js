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
			select:	function(combo, record, options){			
				if(!combo.chains)
					return;
				
				var chains = combo.chains;
				var form = combo.ownerCt.form;					
				var uid = combo.getValue();
				
				Ext.Array.each(chains, function(chain) {			
					var comboChained = form.findField(chain.name);
					
					if(!comboChained)
						Ext.Error.raise('Combo chain: ' + chain.name + 'not found on the form');
						
					var chained = comboChained.chained;								
					
					Ext.Array.each(chained, function(chaind) {					
						if(combo.name==chaind.name)					
							chaind.value = uid;
					});		
					
					if(comboChained.checkIsReady())
						comboChained.load();
					else
						comboChained.clear();
						
				},this);
			}			
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
		this.clear();
		this.setDisabled(false);
		
		Ext.Array.each(this.chained, function(chained) {				 
			this.getStore().proxy.extraParams[chained.key] = chained.value;
		},this);
		var store =this.getStore();		
		store.load();			
	},	
	chained: null,
	chains: null,
});
