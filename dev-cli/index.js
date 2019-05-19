const create = require('./create-school');
const changeCase = require('change-case');
const school_pb = require('./proto/school_pb');
// const schools = require('./schools.json');

// const json = {"count":1,"result":[["address","admin0","admin1","admin2","admin3","admin4","admin_code","admin_id","altitude","availability_connectivity","connectivity","country_code","datasource","description","educ_level","electricity","environment","frequency","latency_connectivity","lat","lon","name","num_classrooms","num_latrines","num_teachers","num_students","num_sections","phone_number","postal_code","speed_connectivity","type_connectivity","type_school","water","created_at","updated_at","probe_id","probe_provider","isp_id","school_id","id_0","id_1","id_2","id_3","id_4","id_5"],["AVENIDA VEREADOR JOVITO FERREIRA SOARES SN",null,"GO","IsraelÃ¢ndia","CENTRO",null,null,null,null,null,null,"BR","BR-ProCo-0-MCTIC-1.csv",null,null,null,"urban",null,null,-12.373148,-49.426376,"COLEGIO MUNICIPAL BOAS NOVAS",null,null,null,169,null,"nd","76205000",2,"PBLE",null,null,"2017-10-10T15:18:03.769Z","2017-10-10T15:18:03.845Z",null,null,null,null,"33","27","5417","10097",null,null]],"hasNext":false};
// const keys = json.result[0];
// const obj = {};
// json.result[1].forEach((v,i) => obj[keys[i]] = v);
// const school = new school_pb.School();
// Object.keys(obj).forEach(k => {
//     const key = changeCase.camelCase(`set ${k}`);
//     switch (key) {
//         case "setAddress":
//             obj[k] !== null ? school.setAddress(obj[k]) : null;
//             break;
//         case "setAdmin0":
//             obj[k] !== null ? school.setAdmin0(obj[k]) : null;
//             break;
//         case "setAdmin1":
//             obj[k] !== null ? school.setAdmin1(obj[k]) : null;
//             break;
//         case "setAdmin2":
//             obj[k] !== null ? school.setAdmin2(obj[k]) : null;
//             break;
//         case "setAdmin3":
//             obj[k] !== null ? school.setAdmin3(obj[k]) : null;
//             break;
//         case "setAdmin4":
//             obj[k] !== null ? school.setAdmin4(obj[k]) : null;
//             break;
//         case "setAdminCode":
//             obj[k] !== null ? school.setAdminCode(obj[k]) : null;
//             break;
//         case "setAdminId":
//             obj[k] !== null ? school.setAdminId(obj[k]) : null;
//             break;
//         case "setAltitude":
//             obj[k] !== null ? school.setAltitude(obj[k]) : null;
//             break;
//         case "setAvailabilityConnectivity":
//             obj[k] !== null ? school.setAvailabilityConnectivity(obj[k]) : null;
//             break;
//         case "setConnectivity":
//             obj[k] !== null ? school.setConnectivity(obj[k]) : null;
//             break;
//         case "setCountryCode":
//             obj[k] !== null ? school.setCountryCode(obj[k]) : null;
//             break;
//         case "setDatasource":
//             obj[k] !== null ? school.setDatasource(obj[k]) : null;
//             break;
//         case "setDescription":
//             obj[k] !== null ? school.setDescription(obj[k]) : null;
//             break;
//         case "setEducLevel":
//             obj[k] !== null ? school.setEducLevel(obj[k]) : null;
//             break;
//         case "setElectricity":
//             obj[k] !== null ? school.setElectricity(obj[k]) : null;
//             break;
//         case "setEnvironment":
//             obj[k] !== null ? school.setEnvironment(obj[k]) : null;
//             break;
//         case "setFrequency":
//             obj[k] !== null ? school.setFrequency(obj[k]) : null;
//             break;
//         case "setLatencyConnectivity":
//             obj[k] !== null ? school.setLatencyConnectivity(obj[k]) : null;
//             break;
//         case "setLat":
//             obj[k] !== null ? school.setLat(obj[k]) : null;
//             break;
//         case "setLon":
//             obj[k] !== null ? school.setLon(obj[k]) : null;
//             break;
//         case "setName":
//             obj[k] !== null ? school.setName(obj[k]) : null;
//             break;
//         case "setNumClassrooms":
//             obj[k] !== null ? school.setNumClassrooms(obj[k]) : null;
//             break;
//         case "setNumLatrines":
//             obj[k] !== null ? school.setNumLatrines(obj[k]) : null;
//             break;
//         case "setNumTeachers":
//             obj[k] !== null ? school.setNumTeachers(obj[k]) : null;
//             break;
//         case "setNumStudents":
//             obj[k] !== null ? school.setNumStudents(obj[k]) : null;
//             break;
//         case "setNumSections":
//             obj[k] !== null ? school.setNumSections(obj[k]) : null;
//             break;
//         case "setPhoneNumber":
//             obj[k] !== null ? school.setPhoneNumber(obj[k]) : null;
//             break;
//         case "setPostalCode":
//             obj[k] !== null ? school.setPostalCode(obj[k]) : null;
//             break;
//         case "setSpeedConnectivity":
//             obj[k] !== null ? school.setSpeedConnectivity(obj[k]) : null;
//             break;
//         case "setTypeConnectivity":
//             obj[k] !== null ? school.setTypeConnectivity(obj[k]) : null;
//             break;
//         case "setTypeSchool":
//             obj[k] !== null ? school.setTypeSchool(obj[k]) : null;
//             break;
//         case "setWater":
//             obj[k] !== null ? school.setWater(obj[k]) : null;
//             break;
//         case "setCreatedAt":
//             obj[k] !== null ? school.setCreatedAt(obj[k]) : null;
//             break;
//         case "setUpdatedAt":
//             obj[k] !== null ? school.setUpdatedAt(obj[k]) : null;
//             break;
//         case "setProbeId":
//             obj[k] !== null ? school.setProbeId(obj[k]) : null;
//             break;
//         case "setProbeProvider":
//             obj[k] !== null ? school.setProbeProvider(obj[k]) : null;
//             break;
//         case "setIspId":
//             obj[k] !== null ? school.setIspId(obj[k]) : null;
//             break;
//         case "setSchoolId":
//             obj[k] !== null ? school.setSchoolId(obj[k]) : null;
//             break;
//         case "setId_0":
//             obj[k] !== null ? school.setId0(obj[k]) : null;
//             break;
//         case "setId_1":
//             obj[k] !== null ? school.setId1(obj[k]) : null;
//             break;
//         case "setId_2":
//             obj[k] !== null ? school.setId2(obj[k]) : null;
//             break;
//         case "setId_3":
//             obj[k] !== null ? school.setId3(obj[k]) : null;
//             break;
//         case "setId_4":
//             obj[k] !== null ? school.setId4(obj[k]) : null;
//             break;
//         case "setId_5":
//             obj[k] !== null ? school.setId5(obj[k]) : null;
//             break;
//         default:
//             school.setEnsHost("LOCAL");
//             break;
//     }
// });
// create.create(school);

create.queryState( "f45293cf83e1357eefb8bdf1542850d3163a8d6a4540ecf1794ece02cf83e1357eefb8");