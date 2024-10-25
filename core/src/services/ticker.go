package tickers

import (
	"time"

	"github.com/sebzz2k2/log-pose/core/src/config"
)

func GetAllTickers() []*time.Ticker {
	intervals := []int{
		config.ONE_SEC,
		config.ONE_MIN, config.TEN_MIN, config.FIFTEEN_MIN, config.THIRTY_MIN,
		config.ONE_HR, config.THREE_HR, config.SIX_HR, config.TWELVE_HR, config.ONE_DAY,
	}
	tickers := make([]*time.Ticker, len(intervals))
	for i, interval := range intervals {
		tickers[i] = time.NewTicker(time.Duration(interval) * time.Second)
	}
	return tickers
}
