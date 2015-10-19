function tbmodule() {
TB = {
    utils: TBUtils,
    ui: TBui,
    storage: TBStorage,
    api: redditapi, // don't call this.  But it does work in concept. IE: $.log(TB.api.WIKI_PAGE_UNKNOWN) will print the string 'WIKI_PAGE_UNKNOWN'.

    modules: {},
    moduleList: [],

    register_module: function register_module(module) {
        this.moduleList.push(module.shortname);
        this.modules[module.shortname] = module;
    },

    init: function tbInit() {
        initLoop();

        function initLoop() {
            setTimeout(function init() {

                $.log("TBModule has TBStorage, loading modules", false, "TBinit");
                // call every module's init() method on page load
                for (var i = 0; i < TB.moduleList.length; i++) {
                    var module = TB.modules[TB.moduleList[i]];

                    // Don't do anything with beta modules unless beta mode is enabled
                    // Need TB.setting() call for non-module settings
                    // if (!TB.setting('betamode') && module.setting('betamode')) {
                    if (!TB.storage.getSetting('Utils', 'betaMode', false) && module.config['betamode']) {
                        // skip this module entirely
                        continue;
                    }

                    // Don't do anything with dev modules unless debug mode is enabled
                    // Need TB.setting() call for non-module settings
                    // if (!TB.setting('betamode') && module.setting('betamode')) {
                    if (!TB.storage.getSetting('Utils', 'debugMode', false) && module.config['devmode']) {
                        // skip this module entirely
                        continue;
                    }

                    // lock 'n load
                    if (module.setting('enabled')) {
                        $.log('Loading ' + module.name + ' module', false, 'TBinit');
                        module.init();
                        // unnecessary; we do it in TB.utils.getModSubs now
                        // if (module.config["needs_mod_subs"]) {
                        //     $.log("  We require additional mod subs");
                        //     TB.utils.getModSubs(function init() {
                        //         module.init();
                        //     });
                        // } else {
                        //     module.init();
                        // }
                    }

                }

            }, 50);
        }
    },

    injectSettings: function injectSettings() {
        for (var i = 0; i < this.moduleList.length; i++) {
            var idx = i,
                self = this;

            (function () {
                // wrap each iteration in a self-executing anonymous function, to preserve scope for bindFirst()
                // otherwise, we get the bindFirst callback having `var module` refer to the last time it was set
                // becausde we're in for loop not a special scope, d'oh.
                var module = self.modules[self.moduleList[idx]];

                // Don't do anything with beta modules unless beta mode is enabled
                // Need TB.setting() call for non-module settings
                // if (!TB.setting('betamode') && module.setting('betamode')) {
                if (!TB.storage.getSetting('Utils', 'betaMode', false)
                    && module.config['betamode']
                ) {
                    // skip this module entirely
                    // use `return false` because we're in a self-executing anonymous function
                    return false;
                }
                // Don't do anything with dev modules unless debug mode is enabled
                // Need TB.setting() call for non-module settings
                // if (!TB.setting('betamode') && module.setting('betamode')) {
                if (!TB.storage.getSetting('Utils', 'debugMode', false)
                    && module.config['devmode']
                ) {
                    // skip this module entirely
                    // use `return false` because we're in a self-executing anonymous function
                    return false;
                }


                //
                // build and inject our settings tab
                //

                var moduleHasSettingTab = false, // we set this to true later, if there's a visible setting
                    moduleIsEnabled = false,
                    $tab = $('<a href="javascript:;" class="tb-window-content-' + module.shortname.toLowerCase() + '" data-module="' + module.shortname.toLowerCase() + '">' + module.name + '</a>'),
                    $settings = $('<div class="tb-window-content-' + module.shortname.toLowerCase() + '" style="display: none;"><div class="tb-help-main-content"></div></div>');

                $tab.data('module', module.shortname);

                var $body = $('body');

                for (var j = 0; j < module.settingsList.length; j++) {
                    var setting = module.settingsList[j],
                        options = module.settings[setting];

                    // "enabled" will eventually be special, but for now it just shows up like any other setting
                    // if (setting == "enabled") {
                    //     continue;
                    // }

                    // "enabled" is special during the transition period, while the "Toggle Modules" tab still exists
                    if (setting == "enabled") {
                        moduleIsEnabled = (module.setting(setting) ? true : false);
                        if (options.hasOwnProperty("hidden") && options["hidden"] && !TB.utils.devMode) continue;

                        // blank slate
                        var $setting = $('<p></p>');
                        $setting.append($('<label><input type="checkbox" id="' + module.shortname + 'Enabled" ' + (module.setting(setting) ? ' checked="checked"' : '') + '> ' + options.title + '</label> <a class="tb-help-toggle" href="javascript:;" data-module="' + module.shortname + '" title="Help">?</a>'));

                        $('.tb-window-content .tb-window-content-modules').append($setting);
                        // don't need this on the module's tab, too
                        continue;
                    }

                    // hide beta stuff unless beta mode enabled
                    if (options.hasOwnProperty("betamode")
                        && !TB.storage.getSetting('Utils', 'betaMode', false)
                        && options["betamode"]
                    ) {
                        continue;
                    }

                    // hide dev stuff unless debug mode enabled
                    if (options.hasOwnProperty("devmode")
                        && !TB.storage.getSetting('Utils', 'debugMode', false)
                        && options["devmode"]
                    ) {
                        continue;
                    }

                    // hide hidden settings, ofc
                    if (options.hasOwnProperty("hidden")
                        && options["hidden"] && !TB.utils.devMode
                    ) {
                        continue;
                    }

                    // hide advanced settings
                    if (options.hasOwnProperty("advanced")
                        && options["advanced"] && !TB.utils.advancedMode
                    ) {
                        continue;
                    }

                    moduleHasSettingTab = true;

                    // blank slate
                    var $setting = $('<p></p>'),
                        execAfterInject = [],
                        title = (options.title) ? options.title : '(' + setting + ')',
                        noWrap = false;

                    // automagical handling of input types
                    switch (options.type) {
                        case "boolean":
                            $setting.append($('<label>').append($('<input type="checkbox" />').prop('checked', module.setting(setting))).append(' ' + title));
                            break;
                        case "number":
                            $setting.append($('<label>').append($('<input type="number" />').prop('min', options.min).prop('max', options.max).prop('step', options.step).val(module.setting(setting))).append(' ' + title));
                            break;
                        case "array":
                        case "JSON":
                            var json = JSON.stringify(module.setting(setting), null, 0);
                            $setting.append(title + ':<br />');
                            $setting.append($('<textarea rows="3" cols="80">').val(json)); //No matter shat I do, I can't get JSON to work with an input.
                            break;
                        case "code":
                            $setting.append(title + ':<br />');
                            $setting.append($('<textarea rows="25" cols="80">').val(module.setting(setting)));
                            break;
                        case "subreddit":
                        case "text":
                        case "list":
                            $setting.append(title + ':<br />');
                            $setting.append($('<input type="text" />').val(module.setting(setting)));
                            break;
                        case "sublist":
                            $setting.append(title + ':<br />');
                            $setting.append(TB.ui.selectMultiple.apply(TB.ui, [TB.utils.mySubs, module.setting(setting)]));
                            break;
                        case "selector":
                            var v = module.setting(setting);
                            $setting.append(title + ':<br />');
                            $setting.append(TB.ui.selectSingular.apply(TB.ui, [options.values, v === undefined || v == null || v == '' ? options.default : v]));
                            break;
                        case "syntaxTheme":
                            $setting.append(title + ':<br/>');
                            $setting.append(TB.modules.Syntax.themeSelect);
                            $setting.find('select').attr('id', module.shortname + '_syntax_theme');
                            $setting.append($('\
                    <pre class="syntax-example" id="' + module.shortname + '_syntax_theme_css">\
/* This is just some example code*/\n\
body {\n\
font-family: sans-serif, "Helvetica Neue", Arial;\n\
font-weight: normal;\n\
}\n\
\n\
.md h3, .commentarea h3 {\n\
font-size: 1em;\n\
}\n\
\n\
#header {\n\
border-bottom: 1px solid #9A9A9A; \n\
box-shadow: 0px 1px 3px 1px #B3C2D1;\n\
}\n\
/* This is just some example code, this time to demonstrate word wrapping. If it is enabled this line will wrap to a next line as soon as it hits the box side, if it is disabled this line will just continue creating a horizontal scrollbar */\n\
                    </pre>'));
                            execAfterInject.push(function () {
                                // Syntax highlighter selection stuff
                                $body.addClass('mod-toolbox-ace');
                                var editorSettings = ace.edit(module.shortname + '_syntax_theme_css');
                                editorSettings.setTheme("ace/theme/" + module.setting(setting));
                                editorSettings.getSession().setUseWrapMode(TB.storage.getSetting('SyntaxHighlighter', 'enableWordWrap', true));

                                if (TBUtils.browser == 'chrome') {
                                    ace.config.set("workerPath", chrome.extension.getURL("/libs/"));
                                }
                                editorSettings.getSession().setMode("ace/mode/css");

                                $('#' + module.shortname + '_syntax_theme').val(module.setting(setting));
                                $body.on('change keydown', '#' + module.shortname + '_syntax_theme', function () {
                                    var thingy = $(this);
                                    setTimeout(function () {
                                        editorSettings.setTheme("ace/theme/" + thingy.val());
                                    }, 0);
                                });
                            });
                            break;
                        case "achievement_save":
                            noWrap = true;

                            $.log("----------", false, "TBModule");
                            $.log("GENERATING ACHIEVEMENT PAGE", false, "TBModule");
                            var total = module.manager.getAchievementTotal(),
                                unlocked = module.manager.getUnlockedCount();

                            $.log("  total="+total, false, "TBModule");
                            $.log("  unlocked="+unlocked, false, "TBModule");

                            $setting = $('<div>').attr('class', 'achievements');
                            $setting.append($('<h1>').text("Mod Achievements"));
                            $setting.append($('<p>').text(unlocked + " of " + total + " unlocked"));
                            $setting.append('<br />');

                            var save = module.setting(setting);
                            save = module.manager.decodeSave(save);

                            var $list = $('<div>').attr('class', 'achievements-list');
                            for(var saveIndex = 0; saveIndex < module.manager.getAchievementBlockCount(); saveIndex++) {
                                $.log("  saveIndex: "+saveIndex, false, "TBModule");
                                for (var index = 0; index < module.manager.getAchievementCount(saveIndex); index++) {
                                    $.log("  index: "+index, false, "TBModule");
                                    var aTitle = "???",
                                        aDescr = "??????",
                                        aClass = "";

                                    if (module.manager.isUnlocked(saveIndex, index, save) || TB.utils.devMode) {
                                        var a = module.manager.getAchievement(saveIndex, index);
                                        aTitle = a.title;
                                        aDescr = a.descr;
                                        aClass = "unlocked";
                                    }

                                    var $a = $('<div>').attr('class', 'achievement ' + aClass);
                                    $a.append($('<p>').attr('class', 'title').html(aTitle));
                                    $a.append($('<p>').attr('class', 'description').text(aDescr));
                                    $list.append($a);
                                }
                            }
                            $setting.append($list);

                            break;
                        default:
                            // what in the world would we do here? maybe raw JSON?
                            // yes, we do raw JSON
                            var json = JSON.stringify(module.setting(setting), null, 0);
                            $setting.append(title + ':<br />');
                            $setting.append($('<textarea rows="1">').val(json)); //No matter shat I do, I can't get JSON to work with an input.
                            break;
                    }
                    if(!noWrap) {
                        $setting = $('<span>').attr('class', 'setting-item').append($setting);
                        $setting.attr('id', 'tb-' + module.shortname + '-' + setting);
                        $setting.data('module', module.shortname);
                        $setting.data('setting', setting);
                    }

                    $settings.append($setting);
                }

                // if ($settings.find('input').length > 0) {
                if (moduleHasSettingTab) {
                    // attach tab and content
                    if (!moduleIsEnabled) {
                        $tab.addClass('tb-module-disabled');
                        $tab.attr('title', 'This module is not active, you can activate it in the "Toggle Modules" tab.')
                        $settings.prepend('<span class="tb-module-disabled">This module is not active, you can activate it in the "Toggle Modules" tab.</span>')
                    }
                    $('.tb-settings .tb-window-tabs a:nth-last-child(1)').before($tab);
                    $('.tb-settings .tb-window-content').append($settings);

                    // stuff to exec after inject:
                    for (var i = 0; i < execAfterInject.length; i++) {
                        execAfterInject[i]();
                    }
                } else {
                    // module has no settings, for now don't inject a tab
                }


                // we use a jQuery hack to stick this bind call at the top of the queue,
                // so that it runs before the bind call in notifier.js
                // this way we don't have to touch notifier.js to make it work.
                //
                // We get one additional click handler for each module that gets injected.
                $body.bindFirst('click', '.tb-save', function (event) {
                    // handle module enable/disable on Toggle Modules first
                    var $moduleEnabled = $('.tb-window-content .tb-window-content-modules #' + module.shortname + 'Enabled').prop('checked');
                    module.setting('enabled', $moduleEnabled);

                    // handle the regular settings tab
                    var $settings_page = $('.tb-window-content-' + module.shortname.toLowerCase());

                    $settings_page.find('span.setting-item').each(function () {
                        var $this = $(this),
                            value = '';

                        // automagically parse input types
                        switch (module.settings[$this.data('setting')].type) {
                            case 'boolean':
                                value = $this.find('input').prop('checked');
                                break;
                            case 'number':
                                value = JSON.parse($this.find('input').val());
                                break;
                            case "array":
                            case "JSON":
                                value = JSON.parse($this.find('textarea').val());
                                break;
                            case 'code':
                                value = $this.find('textarea').val();
                                break;
                            case "subreddit":
                                value = TB.utils.cleanSubredditName($this.find('input').val());
                                break;
                            case 'text':
                                value = $this.find('input').val();
                                break;
                            case 'list':
                                value = $this.find('input').val().split(',').map(function (str) {
                                    return str.trim();
                                }).clean("");
                                break;
                            case 'sublist':
                                value = [];
                                $.each($this.find('.selected-list option'), function () {
                                    value.push($(this).val());
                                });
                                break;
                            case 'selector':
                                value = $this.find('.selector').val();
                                break;
                            case 'syntaxTheme':
                                value = $this.find('#' + module.shortname + '_syntax_theme').val();
                                break;
                            default:
                                value = JSON.parse($this.find('textarea').val());
                                break;
                        }

                        module.setting($this.data('setting'), value);
                    });
                });
            }());
        }
    }
};

// Prototype for all toolbox modules
TB.Module = function Module(name) {
    // PUBLIC: Module Metadata
    this.name = name;

    this.config = {
        "betamode": false,
        "devmode": false,
        "needs_mod_subs": false
    };

    this.settings = {};
    this.settingsList = [];

    this.register_setting = function register_setting(name, setting) {
        this.settingsList.push(name);
        this.settings[name] = setting;
    };

    this.register_setting(
        "enabled", { // this one serves as an example as well as the absolute minimum setting that every module has
            "type": "boolean",
            "default": false,
            "betamode": false, // optional
            "hidden": false, // optional
            "title": "Enable " + this.name
        });

    // PUBLIC: settings interface
    this.setting = function setting(name, value) {
        // are we setting or getting?
        if (typeof value !== "undefined") {
            // setting
            return TB.storage.setSetting(this.shortname, name, value);
        } else {
            // getting
            // do we have a default?
            if (this.settings.hasOwnProperty(name)
                && this.settings[name].hasOwnProperty("default")
            ) {
                // we know what the default should be
                return TB.storage.getSetting(this.shortname, name, this.settings[name]["default"])
            } else {
                // getSetting defaults to null for default value, no need to pass it explicitly
                return TB.storage.getSetting(this.shortname, name);
            }
        }
    };

    this.log = function (message, skip) {
        if (!TBUtils.debugMode) return;
        if (skip === undefined) skip = false;
        $.log(message, skip, this.shortname);
    };

    // Profiling

    var profile = new Map(),
        startTimes = new Map();

    this.startProfile = function (key) {
        if (!TB.utils.debugMode)
            return;

        startTimes.set(key, performance.now());

        // New key: add a new profile
        if (!profile.has(key)) {
            profile.set(key, {time: 0, calls: 1});
        }
        // Existing key: increment calls
        else {
            profile.get(key).calls++;
        }
    };

    this.endProfile = function (key) {
        if (!TB.utils.debugMode)
            return;

        // Never started profiling for the key
        if (!startTimes.has(key))
            return;

        // Get spent time
        var diff = performance.now() - startTimes.get(key);
        startTimes.delete(key);

        // Must have been started, so the object exists
        profile.get(key).time += diff;
    };

    this.getProfiles = function () {
        return profile;
    };

    // PUBLIC: placeholder init(), just in case
    this.init = function init() {
        // pass
    };
};

TB.Module.prototype = {
    _shortname: '',
    get shortname() {
        // return name.trim().toLowerCase().replace(' ', '_');
        return this._shortname.length > 0 ? this._shortname : this.name.trim().replace(/\s/g, '');
    },
    set shortname(val) {
        this._shortname = val;
    }
};
}

(function() {
    window.addEventListener("TBUtilsLoaded", function () {
        $.log("TBModule has TBUtils", false, "TBinit");
        tbmodule();

        var event = new CustomEvent("TBModuleLoaded");
        window.dispatchEvent(event);
    });
})();
