const Gio = imports.gi.Gio;
const Util = imports.misc.util;
const Clutter = imports.gi.Clutter;

const St = imports.gi.St;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;
const Gettext = imports.gettext;
const _ = Gettext.gettext;

const TERMINAL_SCHEMA = 'org.gnome.desktop.default-applications.terminal';
const EXEC_KEY = 'exec';
const EXEC_ARG_KEY = 'exec-arg';

function PlacesButton() {
    this._init();
}

PlacesButton.prototype = {
    __proto__: PanelMenu.Button.prototype,

    _init: function() {
        PanelMenu.Button.prototype._init.call(this, 0.0);


        this._commandSection = new PopupMenu.PopupMenuSection();
        this.menu.addMenuItem(this._commandSection);

        this._label = new St.Label({ text: _("Connect") });
        this.actor.set_child(this._label);
        
        let entry = new St.Entry({ style_class: 'add-command-entry' });
        this._entryText = entry.clutter_text;
        this.actor.add(entry);


        this._terminalSettings = new Gio.Settings({ schema: TERMINAL_SCHEMA });

        let exec = this._terminalSettings.get_string(EXEC_KEY);
        let exec_arg = this._terminalSettings.get_string(EXEC_ARG_KEY);
        command = exec + ' ' + exec_arg + ' gnome-terminal';

        this.myItem = new PopupMenu.PopupMenuItem(_("alx.homelinux.com"));
        this.menu.addMenuItem(this.myItem);
        this.myItem.connect('activate', function(actor,event) {
            Util.trySpawnCommandLine("gnome-terminal -e 'ssh alx.homelinux.com'");
        });

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        Main.panel._centerBox.add(this.actor, { y_fill: true });
        Main.panel._menus.addMenu(this.menu);

    },

    _showCommands:function(){
        
    },

    _showEntry:function(){
        
    }

};

function main(extensionMeta) {

    let userExtensionLocalePath = extensionMeta.path + '/locale';
    Gettext.bindtextdomain("places_button", userExtensionLocalePath);
    Gettext.textdomain("places_button");

    new PlacesButton();
}
