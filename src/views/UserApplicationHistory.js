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
      <Tabs centered value={selectedTab}>
        <Tab label="Applications"/>
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
                  <TableCell/>
                  <TableCell/>
                  <TableCell align='center'>You have no submitted applications.</TableCell>
                  <TableCell/>
                  <TableCell/>
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