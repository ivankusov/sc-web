SCWeb.ui.LanguagePanel = {
	
	/*!
     * Initialize settings panel.
     * @param {Object} params Parameters for panel initialization.
     * There are required parameters:
     * - languages - list of available natural languages
     */
    init: function(params, callback) {
		this.languages = params.languages;
		
		var html = '';
		for (i in this.languages) {
			var addr = this.languages[i];
			
			html += '<option sc_addr="' + addr + '">' + addr + '</option>';
		}
		
		// append languages to select
		$('#language-select').html(html)
			.val(params.user.current_lang)
			.change(function() {
				SCWeb.ui.Locker.show();
				var addr = $('#language-select option:selected').attr("sc_addr");
				SCWeb.core.Translation.setLanguage(addr, function() {
					SCWeb.ui.Locker.hide();
				});
			});
		
		// listen translation events
		SCWeb.core.EventManager.subscribe("translation/update", this, this.updateTranslation);
		SCWeb.core.EventManager.subscribe("translation/get", this, function(objects) {
			$('#language-select [sc_addr]').each(function(index, element) {
				objects.push($(element).attr('sc_addr'));
			});
		});
		
		callback();
	},
	
	
	// ---------- Translation listener interface ------------
    updateTranslation: function(namesMap) {
        // apply translation
        $('#language-select [sc_addr]').each(function(index, element) {
            var addr = $(element).attr('sc_addr');
            if(namesMap[addr]) {
                $(element).text(namesMap[addr].replace('user::', '').replace('session::', ''));
            }
        });
        
    },
	
};
