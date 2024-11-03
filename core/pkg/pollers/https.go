package pollers

import (
	"bytes"
	"errors"
	"io/ioutil"
	"net/http"
)

func HTTPRequest(url, method string, body []byte, headers map[string]string) ([]byte, int, error) {
	var requestBody *bytes.Buffer
	if body != nil {
		requestBody = bytes.NewBuffer(body)
	} else {
		requestBody = nil
	}
	req, err := http.NewRequest(method, url, requestBody)
	if err != nil {
		return nil, 0, err
	}
	for key, value := range headers {
		req.Header.Set(key, value)
	}
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, 0, err
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, resp.StatusCode, errors.New("request failed with status: " + resp.Status)
	}
	responseBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, resp.StatusCode, err
	}
	return responseBody, resp.StatusCode, nil
}
