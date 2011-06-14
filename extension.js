const Gio = imports.gi.Gio;
const Util = imports.misc.util;
const Clutter = imports.gi.Clutter;
const GLib = imports.gi.GLib;
const Shell = imports.gi.Shell;

const St = imports.gi.St;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;
const Gettext = imports.gettext;
const _ = Gettext.gettext;

const TERMINAL_SCHEMA = 'org.gnome.desktop.default-applications.terminal';
const EXEC_KEY = 'exec';
const EXEC_ARG_KEY = 'exec-arg';
const SSH_HOSTFILE = '.mysshconnecter';

function PlacesButton() {
    this._init();
}

PlacesButton.prototype = {
    __proto__: PanelMenu.Button.prototype,

    _init: function() {
        PanelMenu.Button.prototype._init.call(this, 0.0);
	
	let path = GLib.get_home_dir() + '/' + SSH_HOSTFILE;
	let hostBookmarks = Shell.get_file_contents_utf8_sync(path);
	let bookmarks = hostBookmarks.split('\n');

        this._label = new St.Label({ text: _("Connect") });
        this.actor.set_child(this._label);

	for(let i = 0; i < bookmarks.length; i++){
		if(bookmarks[i].length > 0)
        	this._createShortcut(bookmarks[i]);
	}

        //this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        Main.panel._centerBox.add(this.actor, { y_fill: true });
        Main.panel._menus.addMenu(this.menu);

    },

    _createShortcut : function(host){
        this._terminalSettings = new Gio.Settings({ schema: TERMINAL_SCHEMA });

        let exec = this._terminalSettings.get_string(EXEC_KEY);
        let exec_arg = this._terminalSettings.get_string(EXEC_ARG_KEY);
        command = exec + ' ' + exec_arg + ' gnome-terminal';

        this.myItem = new PopupMenu.PopupMenuItem(host);
	this.myItem.host = host;
        this.menu.addMenuItem(this.myItem);
        this.myItem.connect('activate', function(actor,event) {
            Util.trySpawnCommandLine("gnome-terminal -e 'ssh " + actor.host + "'");
        });
    }

};

function main(extensionMeta) {

    let userExtensionLocalePath = extensionMeta.path + '/locale';
    Gettext.bindtextdomain("places_button", userExtensionLocalePath);
    Gettext.textdomain("places_button");

    new PlacesButton();
}
