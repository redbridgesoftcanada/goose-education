import { useMediaQuery, useTheme } from '@material-ui/core';

const STATUSES = ['Submitted', 'Pending Review', 'Tuition Required', 'Approved'];

const TAGS = ['All', 'Shopping', 'Weather', 'Event', 'Restaurant', 'Traffic', 'Sale', 'Scenery', 'Other'];

const FILTER_OPTIONS = ['Title', 'Contents', 'Title + Contents', 'Author'];   // 'Author (코)', 'Member ID', 'Member ID (코)';

const FILTER_CONJUNCTIONS = ["And", "Or"];

// W E B  P A G E S
const ADMIN_PAGES = ["Overview", "Users", "Schools", "Applications", "Homestays", "Airport Rides", "Goose Tips", "Articles", "Announcements", "Messages", "Settings"];

const NAV_PAGES = ['All', 'Goose Study Abroad', 'Networking', 'School Information', 'Study Abroad Services', 'Service Centre'];

// F O R M  F I E L D S
const PERSONAL_FIELDS = ['last_name', 'first_name', 'gender', 'birth_date', 'email', 'phone_number', 'emergency_contact_number', 'emergency_contact_relation', 'address'];

const PROGRAM_FIELDS = ['school_name', 'program_name', 'program_duration', 'program_start_date'];

const ARRIVAL_FIELDS = ['arrival_flight_date', 'arrival_flight_name'];

const DEPARTURE_FIELDS = ['departure_flight_date', 'departure_flight_name'];

const HOMESTAY_FIELDS = ['homestay_start_date', 'homestay_end_date'];

const OTHER_FIELDS = ['insurance', 'visa', 'additional_requests'];

const SCHOOL_TYPES = ['ESL', 'Junior College', 'Private Institution', 'Technical & Vocational', 'University'];

// B R E A K P O I N T S
const MuiThemeBreakpoints = () => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  const md = useMediaQuery(theme.breakpoints.down('md'));
  const lg = useMediaQuery(theme.breakpoints.down('lg'));
  const range = useMediaQuery(theme.breakpoints.between('xs', 'md'));

  return { xs, sm, md, lg, range };
}

export { STATUSES, TAGS, ADMIN_PAGES, NAV_PAGES, FILTER_OPTIONS, FILTER_CONJUNCTIONS, SCHOOL_TYPES, PERSONAL_FIELDS, PROGRAM_FIELDS, ARRIVAL_FIELDS, DEPARTURE_FIELDS, HOMESTAY_FIELDS, OTHER_FIELDS, MuiThemeBreakpoints }
