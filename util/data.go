package util

import "encoding/json"

// IsJSON Return true or false based on if a byte array is json or not.
func IsJSON(data []byte) bool {
	var message map[string]interface{}
	return json.Unmarshal(data, &message) == nil
}
