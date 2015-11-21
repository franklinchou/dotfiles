-- Weather widget stub
-- Currently implement in rc.lua
-- Franklin Chou (franklin.chou@yahoo.com)
-- 21 Nov. 2015

-- Create weather widget
weatherwidget = wibox.widget.textbox()

function weatherInfo()
    -- heavy lifting is handled by python script
    local f = assert(io.popen('/home/fmc/.config/awesome/awm_weather.py'))
    local s = assert(f:read("*a"))
    if s == '| locerr ' then
        naughty.notify({
            preset = naughty.config.presets.critical,
            title = "Weather widget",
            text = "Location invalid. Reset location code and restart windows manager.",
            timeout = 10
        })
    end
    f.close()
    
    return s
end

weatherwidget:set_markup(weatherInfo())
weatherwidgettimer = timer({ timeout = 900 })
weatherwidgettimer:connect_signal("timeout", function()
    weatherwidget:set_markup(weatherInfo())
end)
weatherwidgettimer:start()

-- add the following to layout:
right_layout:add(memwidget)
