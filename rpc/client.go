package rpc

import (
	"github.com/BadgeForce/sawtooth-utils"
	"github.com/golang/protobuf/proto"
	"github.com/kc1116/ethnyc-unicef-sidechain/protobuffers"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"github.com/rberg2/sawtooth-go-sdk/protobuf/processor_pb2"
)

// Client ...
var Client *utils.RPCClient

var delegateCB = func(request *processor_pb2.TpProcessRequest) (string, interface{}, error) {
	var rpcRequest protobuffers.RPCRequest
	err := proto.Unmarshal(request.GetPayload(), &rpcRequest)
	if err != nil {
		return "", nil, &processor.InvalidTransactionError{Msg: "unable to unmarshal RPC request"}
	}

	switch method := rpcRequest.Method.(type) {
	case *protobuffers.RPCRequest_CreateSchool:
		return protobuffers.Method_CREATE_SCHOOL.String(), method.CreateSchool, nil
	default:
		return "", nil, &processor.InvalidTransactionError{Msg: "invalid RPC method"}
	}
}

func init() {
	handlers := []utils.MethodHandler{CreateSchoolHandle}
	Client = utils.NewRPCClient(handlers, delegateCB)
}
