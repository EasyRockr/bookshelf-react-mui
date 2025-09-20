import React, { useMemo, useState } from "react";
import {
  Box, Grid, Card, CardContent, Avatar, Typography, Button,
  Tabs, Tab, TextField, Chip, Stack, Divider, List, ListItem,
  ListItemIcon, ListItemText, Tooltip
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CakeIcon from "@mui/icons-material/Cake";
import WcIcon from "@mui/icons-material/Wc";
import DownloadIcon from "@mui/icons-material/Download";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const PEOPLE = [
  {
    initials: "FA",
    name: "ADRIANO, Franz Rainier C.",
    title: "Full-Stack Dev",
    location: "Bulacan",
    phone: "09123456789",
    email: "franzrainierc.adriano@citco.com",
    dob: "August 03, 2003",
    gender: "♂︎",
    cv: "/cv-franz.pdf",
    skills: [
      "HTML","CSS","JavaScript","PHP","C","C++","C#","Java","Python","Salesforce Apex",
      "MySQL","Microsoft SQL Server","Firebase (NoSQL)","SOQL","ReactJS","Laravel PHP",
      "Tailwind CSS","Django","Bootstrap","VS Code","Visual Studio","PyCharm",
      "Figma","Spline 3D","Microsoft Visio","Unity","Google Sites","Salesforce",
      "Adobe Photoshop","Adobe Illustrator","Blender","Premiere Pro","After Effects",
      "Jira","Trello","Slack","Git","GitHub"
    ]
  },
  {
    initials: "RM",
    name: "MIRANDA, Robin",
    title: "Full-Stack Dev",
    location: "Bulacan",
    phone: "09123456780",
    email: "robin.miranda@example.com",
    dob: "May 12, 2003",
    gender: "♂︎",
    cv: "/cv-robin.pdf",
    skills: [
      "ReactJS","Material-UI","Node.js","Express","MongoDB","REST APIs","Axios",
      "Vite","React Router","HTML","CSS","Git","GitHub","Docker","CI/CD","Unit Testing"
    ]
  }
];

const chipStyle = (label) => {
  const palette = ["#60a5fa","#22d3ee","#34d399","#f59e0b","#a78bfa","#fb7185","#f97316"];
  const i = (label.charCodeAt(0) + label.length) % palette.length;
  const bg = palette[i];
  return {
    bgcolor: alpha(bg, 0.28),
    border: `1px solid ${alpha(bg, 0.7)}`,
    color: "#fff",
    fontWeight: 800
  };
};

function PersonCard({ p }) {
  const [tab, setTab] = useState(0);
  const [q, setQ] = useState("");
  const skills = useMemo(
    () => (!q ? p.skills : p.skills.filter((s) => s.toLowerCase().includes(q.toLowerCase()))),
    [p.skills, q]
  );

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        background: `linear-gradient(180deg, ${alpha("#0e1116",0.9)}, ${alpha("#0b0f14",0.95)})`,
        boxShadow: `0 12px 40px ${alpha("#000",0.7)}`
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Stack alignItems="center" spacing={1.25} sx={{ pt: 1 }}>
          <Avatar
            sx={{
              width: 160, height: 160, fontSize: 54, fontWeight: 900,
              bgcolor: alpha("#6aa8ff", 0.22), color: "#c7dcff",
              border: `3px solid ${alpha("#6aa8ff",0.8)}`
            }}
          >
            {p.initials}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 900, textAlign: "center" }}>{p.name}</Typography>
          <Typography sx={{ opacity: 0.85 }}>{p.title}</Typography>
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 0.5, flexWrap: "wrap" }}>
            <Tooltip title="Download CV">
              <Button startIcon={<DownloadIcon />} variant="contained" href={p.cv} download>
                Download CV
              </Button>
            </Tooltip>
            <Tooltip title="Contact">
              <Button startIcon={<MailOutlineIcon />} variant="outlined" href={`mailto:${p.email}`}>
                Contact
              </Button>
            </Tooltip>
          </Stack>
        </Stack>

        <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.12)" }} />

        <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        centered                 // centers the tabs
        textColor="primary"
        indicatorColor="primary"
        sx={{
            maxWidth: 360,         // keep the tab row compact
            mx: "auto",            // center the whole Tabs container
            "& .MuiTab-root": { fontWeight: 800, minWidth: 120 }
        }}
        >
        <Tab label="ABOUT" />
        <Tab label="SKILLS" />
        </Tabs>


        {tab === 0 && (
          <List dense sx={{ pt: 1 }}>
            <ListItem><ListItemIcon><LocationOnIcon /></ListItemIcon><ListItemText primary={p.location}/></ListItem>
            <ListItem><ListItemIcon><PhoneIcon /></ListItemIcon><ListItemText primary={p.phone} /></ListItem>
            <ListItem><ListItemIcon><EmailIcon /></ListItemIcon><ListItemText primary={p.email} /></ListItem>
            <ListItem><ListItemIcon><CakeIcon /></ListItemIcon><ListItemText primary={p.dob} /></ListItem>
            <ListItem><ListItemIcon><WcIcon /></ListItemIcon><ListItemText primary={p.gender} /></ListItem>
          </List>
        )}

        {tab === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                fullWidth size="small" placeholder="Filter skills…"
                value={q} onChange={(e) => setQ(e.target.value)}
                sx={{ "& .MuiInputBase-root": { bgcolor: "rgba(255,255,255,0.04)", borderRadius: 2 } }}
              />
              <Typography variant="caption" sx={{ opacity: 0.8, whiteSpace: "nowrap" }}>
                {skills.length}/{p.skills.length}
              </Typography>
            </Stack>
            <Box sx={{
              display: "flex", flexWrap: "wrap", gap: 1, maxHeight: 260, overflow: "auto", pr: 0.5,
              "&::-webkit-scrollbar": { width: 8 }, "&::-webkit-scrollbar-thumb": { background: "rgba(106,168,255,0.4)", borderRadius: 8 }
            }}>
              {skills.map((s) => <Chip key={s} size="small" label={s} sx={chipStyle(s)} />)}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default function About() {
  return (
    <Box sx={{ px: { xs: 1.5, md: 3 }, py: { xs: 2, md: 3 } }}>
      <Typography variant="h4" sx={{ mb: 2, textAlign: "center", fontWeight: 900 }}>
        About the Developers
      </Typography>

      {/* HORIZONTAL layout: side-by-side from md+, stacked on xs/sm */}
<Grid container spacing={2.5} alignItems="stretch" justifyContent="center">
  <Grid item xs={12} md={6} sx={{ display: "flex" }}>
    <Box sx={{ width: "100%", maxWidth: 700, mx: "auto" }}>
      <PersonCard p={PEOPLE[0]} />
    </Box>
  </Grid>
  <Grid item xs={12} md={6} sx={{ display: "flex" }}>
    <Box sx={{ width: "100%", maxWidth: 700, mx: "auto" }}>
      <PersonCard p={PEOPLE[1]} />
    </Box>
  </Grid>
</Grid>

    </Box>
  );
}
