package pkg

const ProjectDirName = "log-pose"

const (
	TEN_SEC     = 10
	ONE_MIN     = 60
	TEN_MIN     = 600
	FIFTEEN_MIN = 900
	THIRTY_MIN  = 1800
	ONE_HR      = 3600
	THREE_HR    = 10800
	SIX_HR      = 21600
	TWELVE_HR   = 43200
	ONE_DAY     = 86400
)

var Intervals = []int{
	TEN_SEC,
	ONE_MIN,
	TEN_MIN,
	FIFTEEN_MIN,
	THIRTY_MIN,
	ONE_HR,
	THREE_HR,
	SIX_HR,
	TWELVE_HR,
	ONE_DAY,
}

const PUB_MONITOR_Q = "publish_monitors"
