--
-- brightness lua code stub
-- fmc (franklin.chou@yahoo.com)
-- last modified 20 Nov 2015
--

-- Create brightness widget
function brightnessInfo()
    local backlight_dir = "/sys/class/backlight/intel_backlight"
    local brightness_now = io.open(backlight_dir.."/brightness")
    local brightness_max = io.open(backlight_dir.."/max_brightness")

    local brightness = assert(math.floor(brightness_now:read() * 100 / brightness_max:read()))

    brightness_now:close()
    brightness_max:close()
    return " | Display : "..brightness.."% "
end

brightnesswidget = wibox.widget.textbox()
brightnesswidget:set_markup(brightnessInfo())
