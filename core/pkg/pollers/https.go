package pollers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func HTTPRequest(url, method string, body map[string]interface{}, headers map[string]string) ([]byte, int, error) {
	var requestBody io.Reader
	if body != nil {
		jsonBody, err := json.Marshal(body)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to marshal body: %w", err)
		}
		requestBody = bytes.NewBuffer(jsonBody)
	}
	req, err := http.NewRequest(method, url, requestBody)

	if err != nil {
		return nil, 0, fmt.Errorf("failed to create request: %w", err)
	}
	for key, value := range headers {
		req.Header.Set(key, value)
	}
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, 0, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, resp.StatusCode, fmt.Errorf("failed to read response body: %w", err)
	}
	responseBody = responseBody[:50]
	return responseBody, resp.StatusCode, nil
}
