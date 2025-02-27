local function deepCopy(original)
	local copy = {}

	for key, value in original do
		copy[key] = type(value) == "table" and deepCopy(value) or value
	end

	return copy
end

local function reconcileTable(target, template)
    for k, v in pairs(template) do
        if type(k) == "string" then -- Only string keys will be reconciled
            if target[k] == nil then
                if type(v) == "table" then
                    target[k] = deepCopy(v)
                else
                    target[k] = v
                end
            elseif type(target[k]) == "table" and type(v) == "table" then
                reconcileTable(target[k], v)
            end
        end
    end
end

return reconcileTable