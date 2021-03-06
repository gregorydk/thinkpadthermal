const St 		= imports.gi.St;
const Shell 	= imports.gi.Shell;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Main = imports.ui.main;
const Gtk = imports.gi.Gtk;
const Clutter = imports.gi.Clutter;

const Lang 		= imports.lang;
const Gettext 	= imports.gettext;
const _ 		= Gettext.gettext;
const Extension = imports.misc.extensionUtils.getCurrentExtension();
const LayoutMenuItem = Extension.imports.layout_menu_item;

const ThinkPadThermalStatusIcon = new Lang.Class({
	Name: 'ThinkPadThermalStatusIcon',
	Extends: PanelMenu.Button,
	_init : function (thinkpad_thermal)
	{
		this.parent(0.0);

		this._box = new St.BoxLayout();

		this._cpu_icon	= this._get_icon('cpu');
		this._gpu_icon 	= this._get_icon('gpu');
		this._fan_icon	= this._get_icon('fan');

		this._cpu_value = new St.Label({ text: "0", 	style_class: "tpt-status-cpu"});
		this._gpu_value = new St.Label({ text: "0", 	style_class: "tpt-status-gpu"});
		this._fan_value = new St.Label({ text: "0", 	style_class: "tpt-status-fan"});

		this._cpu_unit	= new St.Label({ text: this._get_unit("cpu"), style_class: "tpt-unit-cpu" });
		this._gpu_unit	= new St.Label({ text: this._get_unit("gpu"), style_class: "tpt-unit-gpu" });
		this._fan_unit	= new St.Label({ text: this._get_unit("fan"), style_class: "tpt-unit-fan" });

		this._box.add_actor (this._cpu_icon);
        this._box.add_actor (this._cpu_value);
        this._box.add_actor (this._cpu_unit);
        
        this._box.add_actor (this._gpu_icon);
        this._box.add_actor (this._gpu_value);
        this._box.add_actor (this._gpu_unit);
        
        this._box.add_actor (this._fan_icon);
        this._box.add_actor (this._fan_value);
        this._box.add_actor (this._fan_unit);

		this.actor.add_actor(this._box);

        this._layouts = new Array();
        
	},
	create_menu : function(name, sensors, values, units)
	{
		this._menu = new LayoutMenuItem.LayoutMenuItem(name);
        this.menu.addMenuItem(this._menu);

		for (let i = 0; i < sensors.length; ++i) {
			let layout = new LayoutMenuItem.LayoutMenuItem(sensors[i], values[i], units[i]);
			this._layouts.push(layout);
			this.menu.addMenuItem(layout);
		}
		this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

	},
	update_values : function(values)
	{
		for (let i = 0; i < values.length; ++i) {
            this._layouts[i].update_values(values[i]);
        }
	},
	_get_icon: function(name, size)
	{
		if (arguments.length == 1)
			size = 16;

		let iconname = "";

		switch (name) {
			case "cpu":
				iconname = "cpu-symbolic";
				break;
			case "gpu":
				iconname = "gpu-symbolic";
				break;
			case "fan":
				iconname = "fan-symbolic";
				break;
			default:
				iconname = "temperature-symbolic";
		}

		return new St.Icon({
			icon_name: iconname,
			icon_size: size
		});
	},
	_get_unit: function(name)
	{
		let unit = "";

		switch (name) {
			case "cpu":
				unit = "\u00b0C";
				break;
			case "gpu":
				unit = "\u00b0C";
				break;
			case "fan":
				unit = "RPM";
				break;
			default:
				unit = "\u00b0C";
		}

		return unit;
	},
	_set_values : function(cpu, gpu, fan)
	{
		this._cpu_value.set_text(cpu);
		this._gpu_value.set_text(gpu);
		this._fan_value.set_text(fan);
	}
});


