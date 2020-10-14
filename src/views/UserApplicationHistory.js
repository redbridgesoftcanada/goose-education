import React, { useState } from 'react';
import { Button, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Tab, Container } from '@material-ui/core';
import { format } from 'date-fns';
import { STATUSES } from '../constants/constants';
import { withAuthorization } from '../components/session';
import TabPanel from '../components/TabPanel';

function UserApplicationHistory(props) {
  const [ selectedTab, setSelectedTab ] = useState(0);

  return (
    <>
      <Tabs centered value={selectedTab}
      onChange={(event, newValue) => setSelectedTab(newValue)}>
        <Tab label="Applications"/>
        <Tab label="Homestays"/>
        <Tab label="Airport Rides"/>
      </Tabs>

      <TabPanel value={selectedTab} index={0}>
        <Container maxWidth='lg'>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>Name</TableCell>
                  <TableCell align='center'>Program</TableCell>
                  <TableCell align='center'>School</TableCell>
                  <TableCell align='center'>Date Submitted</TableCell>
                  <TableCell align='center'>Status</TableCell>
                  <TableCell align='center'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.applications && props.applications.length ? 
                  props.applications.map(application => {
                    return (
                      <TableRow key={application.id}>
                        <TableCell align='center'>{application.firstName} {application.lastName}</TableCell>
                        <TableCell align='center'>{application.programName} ({application.programDuration} weeks)</TableCell>
                        <TableCell align='center'>{application.schoolName}</TableCell>
                        <TableCell align='center'>{format(application.createdAt, 'P')}</TableCell>
                        <TableCell align='center'>{application.status}</TableCell>
                        <TableCell align='center'>
                          {(application.status !== STATUSES[2]) && "No changes can be made at this time."}
                          {(application.status === STATUSES[2]) && 
                            <Button size="small" color="secondary" href='mailto:goose.education@gmail.com'>
                              Pay Tuition
                            </Button>}
                        </TableCell>
                      </TableRow>
                    )
                  })
                :
                <TableRow>
                  <TableCell align='center' colSpan={6}>You have no submitted applications.</TableCell>
                </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
      <Container maxWidth='lg'>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>Name</TableCell>
                  <TableCell align='center'>Start Date</TableCell>
                  <TableCell align='center'>End Date</TableCell>
                  <TableCell align='center'>Arrival Flight</TableCell>
                  <TableCell align='center'>Arrival Date</TableCell>
                  <TableCell align='center'>Date Submitted</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.homestay && props.homestay.length ? 
                  props.homestay.map(application => {
                    return (
                      <TableRow key={application.id}>
                        <TableCell align='center'>{application.firstName} {application.lastName}</TableCell>
                        <TableCell align='center'>{format(application.homestayStartDate.toDate(), 'P')}</TableCell>
                        <TableCell align='center'>{format(application.homestayEndDate.toDate(), 'P')}</TableCell>
                        <TableCell align='center'>{application.arrivalFlightName}</TableCell>
                        <TableCell align='center'>{format(application.arrivalFlightDate.toDate(), 'Pp')}</TableCell>
                        <TableCell align='center'>{format(application.createdAt, 'P')}</TableCell>
                      </TableRow>
                    )
                  })
                : 
                <TableRow>
                  <TableCell align='center' colSpan={6}>You have no submitted homestays.</TableCell>
                </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
      <Container maxWidth='lg'>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>Name</TableCell>
                  <TableCell align='center'>Arrival Flight</TableCell>
                  <TableCell align='center'>Arrival Date</TableCell>
                  <TableCell align='center'>Departure Flight</TableCell>
                  <TableCell align='center'>Departure Date</TableCell>
                  <TableCell align='center'>Date Submitted</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.airport && props.airport.length ? 
                  props.airport.map(application => {
                    return (
                      <TableRow key={application.id}>
                        <TableCell align='center'>{application.firstName} {application.lastName}</TableCell>
                        <TableCell align='center'>{application.arrivalFlightName}</TableCell>
                        <TableCell align='center'>{format(application.arrivalFlightDate.toDate(), 'Pp')}</TableCell>
                        <TableCell align='center'>{application.departureFlightName}</TableCell>
                        <TableCell align='center'>{format(application.departureFlightDate.toDate(), 'Pp')}</TableCell>
                        <TableCell align='center'>{format(application.createdAt, 'P')}</TableCell>
                      </TableRow>
                    )
                  })
                : 
                <TableRow>
                  <TableCell align='center' colSpan={6}>You have no submitted airport rides.</TableCell>
                </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </TabPanel>
    </>
  );
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(UserApplicationHistory);