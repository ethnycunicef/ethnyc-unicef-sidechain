package main

import (
	"fmt"
	"github.com/BadgeForce/sawtooth-utils"
	"github.com/kc1116/ethnyc-unicef-sidechain/rpc"
	"github.com/kc1116/ethnyc-unicef-sidechain/state"
	"os"
	"path/filepath"
	"strings"

	"github.com/rberg2/sawtooth-go-sdk/logging"
	"github.com/spf13/pflag"
	"github.com/spf13/viper"
)

var logger = logging.Get()
// FamilyName processor family name
const FamilyName = "unicef"

// FamilyVersions transaction processor versions
var FamilyVersions = []string{"1.0"}
func main() {
	pflag.StringP("verbose", "v", "debug", "Log verbosity info|warning|debug")
	pflag.String("validator", "", "Validator endpoint")
	pflag.IntP("worker-queue", "q", 100, "Set the maximum queue size before rejecting process requests")
	pflag.IntP("worker-threads", "t", 0, "Set the number of worker threads to use for processing requests in parallel")
	pflag.StringP("config-file-path", "f", "", "Path to configuration file. Other arguments ignored if this flag is set")
	pflag.BoolP("config-file", "c", false, "If flag is set configurations will be loaded from ConfigFilePath")
	pflag.Parse()

	viper.BindPFlag("use-config", pflag.Lookup("config-file"))
	if viper.GetBool("use-config") {
		viper.BindPFlag("config-file-path", pflag.Lookup("config-file-path"))
		err := parseConfigFile()
		if err != nil {
			logger.Error("error parsing configuration file:  ", err)
			os.Exit(1)
		}
	} else {
		viper.BindPFlags(pflag.CommandLine)
	}

	switch viper.GetString("verbose") {
	case "debug":
		logger.SetLevel(logging.DEBUG)
	case "info":
		logger.SetLevel(logging.INFO)
	default:
		logger.SetLevel(logging.WARN)
	}

	transactionHandler := utils.NewTransactionHandler(rpc.Client, FamilyName, FamilyVersions, []string{state.UnicefSchoolsPrefix})
	p := utils.NewTransactionProcessor(viper.GetString("validator"), transactionHandler)
	err := p.Start()
	if err != nil {
		logger.Error("Processor stopped: ", err)
	}
}

func parseConfigFile() error {
	config := viper.GetString("config-file-path")
	if config == "" {
		return fmt.Errorf("illegal argument for config file path, path must be specified")
	}

	abs, err := filepath.Abs(config)
	if err != nil {
		return fmt.Errorf("error reading filepath: (%s)", err)
	}

	// get the config name
	base := filepath.Base(abs)

	// get the path
	path := filepath.Dir(abs)
	viper.SetConfigType("yaml")
	viper.SetConfigName(strings.Split(base, ".")[0])
	viper.AddConfigPath(path)

	// Find and read the config file; Handle errors reading the config file
	if err := viper.ReadInConfig(); err != nil {
		return fmt.Errorf("error reading configuration file: (%s)", err)
	}

	return nil
}
