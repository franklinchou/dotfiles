--
-- awesome wm configuration
-- fmc (franklin.chou@yahoo.com)
-- last modified 25 Sept 2016


-- CHANGE LOG
-- Multiple monitor support added

--

-- Standard awesome library
local gears = require("gears")
local awful = require("awful")
awful.rules = require("awful.rules")
require("awful.autofocus")

-- Widget and layout library
local wibox = require("wibox")

-- Theme handling library
local beautiful = require("beautiful")

-- Notification library
local naughty = require("naughty")

-- {{{ Error handling

-- Check if awesome encountered an error during startup and fell back to
-- another config (This code will only ever execute for the fallback config)
if awesome.startup_errors then
    naughty.notify({ preset = naughty.config.presets.critical,
                     title = "Oops, there were errors during startup!",
                     text = awesome.startup_errors })
end

-- Handle runtime errors after startup
do
    local in_error = false
    awesome.connect_signal("debug::error", function (err)
        -- Make sure we don't go into an endless error loop
        if in_error then return end
        in_error = true

        naughty.notify({ preset = naughty.config.presets.critical,
                         title = "Oops, an error happened!",
                         text = err })
        in_error = false
    end)
end
-- }}}

-- {{{ Variable definitions
-- Themes define colours, icons, font and wallpapers.
beautiful.init("/home/fmc/.config/awesome/theme.lua")

-- This is used later as the default terminal and editor to run.
terminal = "xterm"
editor = os.getenv("EDITOR") or "vim"
editor_cmd = terminal .. " -e " .. editor

-- Application variables:
chromium = "chromium"
midori = "midori"
firefox = "firefox"

-- Default modkey.
modkey = "Mod4"

-- Table of layouts to cover with awful.layout.inc, order matters.
local layouts =
{
    awful.layout.suit.floating,
    awful.layout.suit.tile,
    awful.layout.suit.tile.left,
    --awful.layout.suit.tile.bottom,
    --awful.layout.suit.tile.top,
    awful.layout.suit.fair,
    awful.layout.suit.fair.horizontal,
    --awful.layout.suit.spiral,
    --awful.layout.suit.spiral.dwindle,
    awful.layout.suit.max,
    awful.layout.suit.max.fullscreen,
    awful.layout.suit.magnifier
}
-- }}}

-- {{{ Wallpaper
if beautiful.wallpaper then
    for s = 1, screen.count() do
        gears.wallpaper.maximized(beautiful.wallpaper, s, true)
    end
end
-- }}}

-- {{{ Tags
-- Define a tag table which hold all screen tags.

tags = {
    names = { "1-desk1", "2-desk2", "3-dev1", "4-dev2", "5-net", "6-media"  },
    layout = { layouts[2], layouts[2], layouts[2], layouts[2], layouts[6], layouts[1] }
}

for s = 1, screen.count() do
    -- Each screen has its own tag table.
    tags[s] = awful.tag(tags.names, s, tags.layout)
end
-- }}}

-- {{{ Menu
-- Create a laucher widget and a main menu
myawesomemenu = {
   { "manual", terminal .. " -e man awesome" },
   { "edit config", editor_cmd .. " " .. awesome.conffile },
   { "restart", awesome.restart },
   { "quit", awesome.quit }
}

mymainmenu = awful.menu({
    items = {
                { "awesome", myawesomemenu, beautiful.awesome_icon },
                { "open terminal", terminal },
                { "chromium", chromium },
                { "midori", midori },
                { "firefox", firefox}
            }
})

mylauncher = awful.widget.launcher({
    image = beautiful.awesome_icon,
    menu  = mymainmenu
})

-- {{{ Wibox

-- Create a textclock widget
mytextclock = awful.widget.textclock()

-- Create battery mgmt wdiget
function batInfo()
    local power_dir = "/sys/class/power_supply/BAT0"
    local power_stat = io.open(power_dir.."/status")
    t = power_stat:read()

    local battery
    local state

    if t == nil then
        battery = ""
        state = "A/C"
    else
        local power_curr = io.open(power_dir.."/energy_now")
        local power_full = io.open(power_dir.."/energy_full")
        battery = assert(math.floor(power_curr:read() * 100 / power_full:read()))
        if t:match("Discharging") then
            state = "/d"
            if tonumber(battery) < 10 then
                naughty.notify({
                    preset = naughty.config.presets.critical,
                    title = "Warning: low battery!",
                    text = "Battery level is below 10%.",
                    timeout = 5
                })
            end
        elseif t:match("Charging") then
            state = "/C"
        else
            state = "/U"
        end
    end

    power_stat:close()
    return " | " .. battery .. state .. " "

end

batterywidget = wibox.widget.textbox()
batterywidgettimer = timer({ timeout = 10 })
batterywidget:set_markup(batInfo())
batterywidgettimer:connect_signal("timeout", function()
    batterywidget:set_markup(batInfo())
end)
batterywidgettimer:start()

-- Create volume widget
volumewidget = wibox.widget.textbox()

function volumeInfo()
    local f = io.popen("amixer get Master | grep -o \'[0-9]\\{1,\\}%\'")
    local s = f:read("*a")
    f:close()

    return "| " .. s
end

volumewidget:set_markup(volumeInfo())

function volume(mode, widget)
    if mode == "up" then
        io.popen("amixer set Master 5%+"):read("*all")
        volumewidget:set_markup(volumeInfo())
    elseif mode == "down" then
        io.popen("amixer set Master 5%-"):read("*all")
        volumewidget:set_markup(volumeInfo())
    end
end

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

-- Create a wibox for each screen and add it
mywibox = {}
mypromptbox = {}
mylayoutbox = {}

mytaglist = {}
mytaglist.buttons = awful.util.table.join(
    awful.button({ }, 1, awful.tag.viewonly),
    awful.button({ modkey }, 1, awful.client.movetotag),
    awful.button({ }, 3, awful.tag.viewtoggle),
    awful.button({ modkey }, 3, awful.client.toggletag),
    awful.button({ }, 4, function(t) awful.tag.viewnext(awful.tag.getscreen(t)) end),
    awful.button({ }, 5, function(t) awful.tag.viewprev(awful.tag.getscreen(t)) end)
)

-- Application task bar
mytasklist = {}
mytasklist.buttons =
    awful.util.table.join(
        -- Functionality for 4th & 5th mouse buttons removed, 23 Feb 2016.
        awful.button({ }, 1,
            function (c)
                if c == client.focus then
                  c.minimized = true
                else
                    -- Without this, the following
                    -- :isvisible() makes no sense
                    c.minimized = false
                    if not c:isvisible() then
                        awful.tag.viewonly(c:tags()[1])
                    end
                    -- This will also un-minimize
                    -- the client, if needed
                    client.focus = c
                    c:raise()
                end
            end
        ),
        awful.button({ }, 3,
            function ()
                if instance then
                    instance:hide()
                    instance = nil
                else
                    instance = awful.menu.clients({
                        theme = { width = 250 }
                    })
                end
            end)
    )

for s = 1, screen.count() do
    -- Create a promptbox for each screen
    mypromptbox[s] = awful.widget.prompt()

    -- Create an imagebox widget which will contains an icon indicating which layout we're using.
    -- We need one layoutbox per screen.
    mylayoutbox[s] = awful.widget.layoutbox(s)
    mylayoutbox[s]:buttons(
        awful.util.table.join(
           awful.button({ }, 1, function () awful.layout.inc(layouts, 1) end),
           awful.button({ }, 3, function () awful.layout.inc(layouts, -1) end),
           awful.button({ }, 4, function () awful.layout.inc(layouts, 1) end),
           awful.button({ }, 5, function () awful.layout.inc(layouts, -1) end)
        )
    )
    -- Create a taglist widget
    mytaglist[s] = awful.widget.taglist(s, awful.widget.taglist.filter.all, mytaglist.buttons)

    -- Create a tasklist widget
    mytasklist[s] = awful.widget.tasklist(s, awful.widget.tasklist.filter.currenttags, mytasklist.buttons)

    -- Create the wibox
    mywibox[s] = awful.wibox({ position = "top", screen = s })

    -- Widgets that are aligned to the left
    local left_layout = wibox.layout.fixed.horizontal()
    left_layout:add(mylauncher)
    left_layout:add(mytaglist[s])
    left_layout:add(mypromptbox[s])

    -- Widgets that are aligned to the right
    local right_layout = wibox.layout.fixed.horizontal()
    if s == 1 then right_layout:add(wibox.widget.systray()) end
    right_layout:add(mytextclock)
    right_layout:add(batterywidget)
    right_layout:add(volumewidget)
    --right_layout:add(brightnesswidget)
    right_layout:add(weatherwidget)
    right_layout:add(mylayoutbox[s])

    -- Now bring it all together (with the tasklist in the middle)
    local layout = wibox.layout.align.horizontal()
    layout:set_left(left_layout)
    layout:set_middle(mytasklist[s])
    layout:set_right(right_layout)

    mywibox[s]:set_widget(layout)
end
-- }}}

-- {{{ Mouse bindings
-- Mouse bindings? Let's not encourage this kind of behavior. Removed, 15 Oct 2015
-- }}}

-- {{{ Key bindings
globalkeys = awful.util.table.join(
    awful.key({ modkey,           }, "Left",   awful.tag.viewprev       ),
    awful.key({ modkey,           }, "Right",  awful.tag.viewnext       ),
    -- awful.key({ modkey,           }, "Escape", awful.tag.history.restore),

    awful.key({ modkey,           }, "j",
        function ()
            awful.client.focus.byidx( 1)
            if client.focus then client.focus:raise() end
        end),
    awful.key({ modkey,           }, "k",
        function ()
            awful.client.focus.byidx(-1)
            if client.focus then client.focus:raise() end
        end),
    awful.key({ modkey,           }, "w", function () mymainmenu:show() end),

    -- Layout manipulation
    awful.key({ modkey, "Shift"   }, "j", function () awful.client.swap.byidx(  1)    end),
    awful.key({ modkey, "Shift"   }, "k", function () awful.client.swap.byidx( -1)    end),
    awful.key({ modkey, "Control" }, "j", function () awful.screen.focus_relative( 1) end),
    awful.key({ modkey, "Control" }, "k", function () awful.screen.focus_relative(-1) end),
    awful.key({ modkey,           }, "u", awful.client.urgent.jumpto),
    awful.key({ modkey,           }, "Tab",
        function ()
            awful.client.focus.history.previous()
            if client.focus then
                client.focus:raise()
            end
        end),

    -- Standard program
    awful.key({ modkey,           }, "Return", function () awful.util.spawn(terminal) end),
    awful.key({ modkey, "Control" }, "r", awesome.restart),
    awful.key({ modkey, "Shift"   }, "q", awesome.quit),

    awful.key({ modkey,           }, "l",     function () awful.tag.incmwfact( 0.05)    end),
    awful.key({ modkey,           }, "h",     function () awful.tag.incmwfact(-0.05)    end),
    awful.key({ modkey, "Shift"   }, "h",     function () awful.tag.incnmaster( 1)      end),
    awful.key({ modkey, "Shift"   }, "l",     function () awful.tag.incnmaster(-1)      end),
    --awful.key({ modkey, "Control" }, "h",     function () awful.tag.incncol( 1)         end),
    --awful.key({ modkey, "Control" }, "l",     function () awful.tag.incncol(-1)         end),
    awful.key({ modkey,           }, "space", function () awful.layout.inc(layouts,  1) end),
    awful.key({ modkey, "Shift"   }, "space", function () awful.layout.inc(layouts, -1) end),

    -- volume control
    awful.key({ modkey,           }, "v",    function()  volume("up", volumewidget) end),
    awful.key({ modkey, "Shift"   }, "v",    function()  volume("down", volumewidget) end),

    -- display control
    awful.key({ modkey, "Control" }, "n", awful.client.restore),

    -- Toggle monitors

    --  screen focus 1
    awful.key({ modkey, }, "F1",
        function ()
            awful.screen.focus(1)
        end
    ),

    --  screen focus 2
    awful.key({ modkey, }, "F2",
        function ()
            awful.screen.focus(2)
        end
    ),


    -- power control
    -- Lenovo T430, #108 binds PrintScreen
    -- awful.key({ modkey, "#108"     }, "p",   function() awful.util.spawn("systemctl poweroff") end),
    awful.key({ modkey, "#108"     }, "r",   function() awful.util.spawn("systemctl reboot") end),
    awful.key({ modkey, "#108"     }, "s",   function() awful.util.spawn("systemctl suspend") end)
)

clientkeys = awful.util.table.join(
    awful.key({ modkey,           }, "f",      function (c) c.fullscreen = not c.fullscreen  end),
    awful.key({ modkey, "Shift"   }, "c",      function (c) c:kill()                         end),

    -- adjust diagonal; for use with floating windows

    -- Toggle floating window
    awful.key({ modkey, "Control" }, "space",  awful.client.floating.toggle                     ),

    awful.key({ modkey,           }, "Prior",  function () awful.client.moveresize(0, 0, -40, -40) end),
    awful.key({ modkey,           }, "Next",   function () awful.client.moveresize(0, 0, 40, 40)   end),
    awful.key({ modkey, "Control" }, "Return", function (c) c:swap(awful.client.getmaster()) end),
    -- awful.key({ modkey,           }, "o",      awful.client.movetoscreen                        ),
    -- awful.key({ modkey,           }, "t",      function (c) c.ontop = not c.ontop            end),

    awful.key({ modkey,           }, "n",
        function (c)
            -- The client currently has the input focus, so it cannot be minimized; minimized clients can't have focus.
            c.minimized = true
        end
    ),

    awful.key({ modkey,           }, "m",
        function (c)
            c.maximized_horizontal = not c.maximized_horizontal
            c.maximized_vertical   = not c.maximized_vertical
        end
    )
)

-- Bind all key numbers to tags.
-- Be careful: we use keycodes to make it works on any keyboard layout.
-- This should map on the top row of your keyboard, usually 1 to 9.
for i = 1, 9 do
    globalkeys = awful.util.table.join(globalkeys,
        -- View tag only.
        awful.key({ modkey }, "#" .. i + 9,
            function ()
                local screen = mouse.screen
                local tag = awful.tag.gettags(screen)[i]
            if tag then
                awful.tag.viewonly(tag)
            end
            end
        ),
        -- Move client to tag.
        awful.key({ modkey, "Shift" }, "#" .. i + 9,
            function ()
                if client.focus then
                    local tag = awful.tag.gettags(client.focus.screen)[i]
                    if tag then
                        awful.client.movetotag(tag)
                    end
                end
            end
        )
    )
end

clientbuttons = awful.util.table.join(
    awful.button({ }, 1, function (c) client.focus = c; c:raise() end),
    awful.button({ modkey }, 1, awful.mouse.client.move),
    awful.button({ modkey }, 3, awful.mouse.client.resize)
)

-- Set keys
root.keys(globalkeys)
-- }}}

-- {{{ Rules
-- Rules to apply to new clients (through the "manage" signal).
awful.rules.rules = {
    -- All clients will match this rule.
    { rule = { },
      properties = { border_width = beautiful.border_width,
                     size_hints_honor = false,
                     border_color = beautiful.border_normal,
                     focus = awful.client.focus.filter,
                     raise = true,
                     keys = clientkeys,
                     buttons = clientbuttons }
    }
}
-- }}}

-- {{{ Signals
-- Signal function to execute when a new client appears.
client.connect_signal("manage", function (c, startup)
    -- Enable sloppy focus
    c:connect_signal("mouse::enter", function(c)
        if awful.layout.get(c.screen) ~= awful.layout.suit.magnifier
            and awful.client.focus.filter(c) then
            client.focus = c
        end
    end)

    if not startup then
        -- Set the windows at the slave,
        -- i.e. put it at the end of others instead of setting it master.
        -- awful.client.setslave(c)

        -- Put windows in a smart way, only if they does not set an initial position.
        if not c.size_hints.user_position and not c.size_hints.program_position then
            awful.placement.no_overlap(c)
            awful.placement.no_offscreen(c)
        end
    end

    local titlebars_enabled = false
    if titlebars_enabled and (c.type == "normal" or c.type == "dialog") then
        -- buttons for the titlebar
        local buttons = awful.util.table.join(
                awful.button({ }, 1, function()
                    client.focus = c
                    c:raise()
                    awful.mouse.client.move(c)
                end),
                awful.button({ }, 3, function()
                    client.focus = c
                    c:raise()
                    awful.mouse.client.resize(c)
                end)
            )

        -- Widgets that are aligned to the left
        local left_layout = wibox.layout.fixed.horizontal()
        left_layout:add(awful.titlebar.widget.iconwidget(c))
        left_layout:buttons(buttons)

        -- Widgets that are aligned to the right
        local right_layout = wibox.layout.fixed.horizontal()
        right_layout:add(awful.titlebar.widget.floatingbutton(c))
        right_layout:add(awful.titlebar.widget.maximizedbutton(c))
        right_layout:add(awful.titlebar.widget.stickybutton(c))
        right_layout:add(awful.titlebar.widget.ontopbutton(c))
        right_layout:add(awful.titlebar.widget.closebutton(c))

        -- The title goes in the middle
        local middle_layout = wibox.layout.flex.horizontal()
        local title = awful.titlebar.widget.titlewidget(c)
        title:set_align("center")
        middle_layout:add(title)
        middle_layout:buttons(buttons)

        -- Now bring it all together
        local layout = wibox.layout.align.horizontal()
        layout:set_left(left_layout)
        layout:set_right(right_layout)
        layout:set_middle(middle_layout)

        awful.titlebar(c):set_widget(layout)
    end
end)

client.connect_signal("focus", function(c) c.border_color = beautiful.border_focus end)
client.connect_signal("unfocus", function(c) c.border_color = beautiful.border_normal end)
-- }}}
