package state

import (
	"fmt"
	"github.com/BadgeForce/sawtooth-utils"
	"github.com/davecgh/go-spew/spew"
	"github.com/golang/protobuf/proto"
	"github.com/kc1116/ethnyc-unicef-sidechain/protobuffers"
	"github.com/rberg2/sawtooth-go-sdk/logging"
	"github.com/rberg2/sawtooth-go-sdk/processor"
)

// UnicefSchoolsPrefix ...
const UnicefSchoolsPrefix = "unicef:schools"

var logger = logging.Get()

// NameSpaceMngr ...
var NameSpaceMngr = *utils.NewNamespaceMngr().RegisterNamespaces(UnicefSchoolsPrefix)

// State ...
type State struct {
	instance *utils.State
}

func (s *State) SchoolStateAddress(ispID, district, schoolID string) string {
	p := utils.NewPart(ispID, 0, 25)
	m := utils.NewPart(district, 0, 25)
	post := utils.NewPart(schoolID, 0, 14)
	addressParts := []*utils.AddressPart{p, m, post}
	address, _ := utils.NewAddress(NameSpaceMngr.NameSpaces[0]).AddParts(addressParts...).Build()
	return address
}

func (s *State) CreateSchool(school *protobuffers.School) error {
	addresses := []string{s.SchoolStateAddress(school.GetIspId(), school.GetId_0(), school.GetSchoolId()),
		s.SchoolStateAddress(school.GetIspId(), school.GetId_1(), school.GetSchoolId()),
		s.SchoolStateAddress(school.GetIspId(), school.GetId_2(), school.GetSchoolId()),
		s.SchoolStateAddress(school.GetIspId(), school.GetId_3(), school.GetSchoolId()),
		s.SchoolStateAddress(school.GetIspId(), school.GetId_4(), school.GetSchoolId())}

	b, err := proto.Marshal(school)
	if err != nil {
		s := fmt.Sprintf("unable to marshal school proto %s", spew.Sdump(school))
		logger.Error(s)
		return &processor.InvalidTransactionError{Msg: s}
	}

	update := make(map[string][]byte)
	for _, address := range addresses {
		logger.Infof(address, b)
		update[address] = b
	}

	_, err = s.instance.Context.SetState(update)
	if err != nil {
		s := fmt.Sprintf("unable to set state update %s", err)
		logger.Error(s)
		return &processor.InvalidTransactionError{Msg: s}
	}

	return nil
}

func NewSate(ctx *processor.Context) *State {
	return &State{utils.NewStateInstance(ctx)}
}