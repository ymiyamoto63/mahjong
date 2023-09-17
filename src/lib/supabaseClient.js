// import { ANON_API_KEY, PROJECT_URL } from '$env/static/private';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
	'https://gdsmfgcekbhuknjwolha.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkc21mZ2Nla2JodWtuandvbGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM4OTk1OTksImV4cCI6MjAwOTQ3NTU5OX0.1-b6h3gQttx1WrJ9yg0bDG2aWLC5muc3WV_9FDCkMlA'
);
