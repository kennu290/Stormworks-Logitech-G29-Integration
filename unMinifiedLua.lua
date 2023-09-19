local onStatus = false

local steering = 0
local throttle = 0
local clutch = 0
local brake = 0
local gear = 0

local forceFeedback = 0
local LEDs = 0

local shift_left = false
local shift_right = false

local xButton = false
local circleButton = false
local triangleButton = false
local squareButton = false

local l2Button = false
local r2Button = false

local l3Button = false
local r3Button = false

local minusButton = false
local plusButton = false

local wheelSpinner = 0
local spinnerButton = false

local shareButton = false
local optionsButton = false
local playstationButton = false

local arrowUp = false
local arrowDown = false
local arrowLeft = false
local arrowRight = false

local tickCounter = 0  -- Counter to track the ticks
local sendInterval = 3

function onTick()
	onStatus = input.getBool(1)
    tickCounter = tickCounter + 1

    forceFeedback = input.getNumber(1)
    LEDs = input.getNumber(2)
	sendInterval = input.getNumber(3)

    -- Convert the variables to strings
    local forceFeedbackStr = tostring(forceFeedback)
    local LEDsStr = tostring(LEDs)

    -- Check if the desired interval has passed and check if microcontroller is on
    if tickCounter % sendInterval == 0 and onStatus == true then
        -- Query the web server for the latest data
        async.httpGet(3000, "/data?forceFeedback=" .. forceFeedbackStr .. "&LEDs=" .. LEDsStr)
    end

    -- Update the vehicle controls based on the retrieved data
    output.setNumber(1, steering)
    output.setNumber(2, throttle)
    output.setNumber(3, clutch)
    output.setNumber(4, brake)
	output.setNumber(5, gear)
	output.setNumber(6, wheelSpinner)
	-- Update the buttons (Composite 6-28 are reserved for button events)
	output.setBool(6, shift_left)
	output.setBool(7, shift_right)
	
	output.setBool(8, xButton)
	output.setBool(9, circleButton)
	output.setBool(10, triangleButton)
	output.setBool(11, squareButton)
	
	output.setBool(12, l2Button)
	output.setBool(13, r2Button)
	
	output.setBool(14, l3Button)
	output.setBool(15, r3Button)
	
	output.setBool(16, minusButton)
	output.setBool(17, plusButton)
	
	output.setBool(18, spinnerButton)
	
	output.setBool(19, shareButton)
	output.setBool(20, optionsButton)
	output.setBool(21, playstationButton)

    output.setBool(22, arrowUp)
    output.setBool(23, arrowDown)
    output.setBool(24, arrowRight)
    output.setBool(25, arrowLeft)

end

function httpReply(port, url, response_body)
    if port == 3000 then
        -- Parse the response and update the values
        if response_body ~= nil then
            local data = parseJSON(response_body)
            if data ~= nil then
                steering = data.steering
                throttle = data.throttle
                clutch = data.clutch
                brake = data.brake
		gear = data.gear
		shift_left = data.shift_left
		shift_right = data.shift_right
				
		xButton = data.xButton
		circleButton = data.circleButton
		triangleButton = data.triangleButton
		squareButton = data.squareButton
				
		l2Button = data.l2Button
		r2Button = data.r2Button
				
		l3Button = data.l3Button
		r3Button = data.r3Button
				
		minusButton = data.minusButton
		plusButton = data.plusButton
				
		wheelSpinner = data.wheelSpinner
		spinnerButton = data.spinnerButton
				
		shareButton = data.shareButton
		optionsButton = data.optionsButton
		playstationButton = data.playstationButton
			
		arrowUp = data.arrowUp
		arrowDown = data.arrowDown
		arrowRight = data.arrowRight
                arrowLeft = data.arrowLeft
			end
        end
    end
end


function parseJSONValue(value)
    -- Remove leading/trailing whitespace
    value = string.gsub(value, "^%s*(.-)%s*$", "%1")
    
    -- Check the type of the value
    if string.sub(value, 1, 1) == "\"" and string.sub(value, -1) == "\"" then
        -- String value, remove leading/trailing quotes
        return string.gsub(value, "^\"(.-)\"$", "%1")
    elseif string.lower(value) == "true" then
        -- Boolean true
        return true
    elseif string.lower(value) == "false" then
        -- Boolean false
        return false
    elseif string.find(value, "[%d%.]+") then
        -- Number value, convert to a Lua number
        return tonumber(value)
    else
        -- Unknown value type, return as-is
        return value
    end
end

