package rpc

import (
	"github.com/kc1116/ethnyc-unicef-sidechain/protobuffers"
	"github.com/kc1116/ethnyc-unicef-sidechain/state"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"github.com/rberg2/sawtooth-go-sdk/protobuf/processor_pb2"
)

// CreateSchoolHandler RPC handler to handle issuing credentials
type CreateSchoolHandler struct {
	method string
}

// Handle ...
func (handler *CreateSchoolHandler) Handle(request *processor_pb2.TpProcessRequest, context *processor.Context, reqData interface{}) error {
	create := reqData.(*protobuffers.Create_School)
	school := create.GetParams()
	return state.NewSate(context).CreateSchool(school)
}

// Method ...
func (handler *CreateSchoolHandler) Method() string {
	return handler.method
}

// CreateSchoolHandle ...
var CreateSchoolHandle = &CreateSchoolHandler{protobuffers.Method_CREATE_SCHOOL.String()}
