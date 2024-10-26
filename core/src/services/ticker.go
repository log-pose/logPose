package services

import (
	"time"

	"github.com/sebzz2k2/log-pose/core/src/config"
)

var Intervals = []int{
	config.TEN_SEC,
	config.ONE_MIN, config.TEN_MIN, config.FIFTEEN_MIN, config.THIRTY_MIN,
	config.ONE_HR, config.THREE_HR, config.SIX_HR, config.TWELVE_HR, config.ONE_DAY,
}

func GetAllTickers() []*time.Ticker {
	tickers := make([]*time.Ticker, len(Intervals))
	for i, interval := range Intervals {
		tickers[i] = time.NewTicker(time.Duration(interval) * time.Second)
	}
	return tickers
}
