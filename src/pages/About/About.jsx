import React, { useMemo, useState } from "react";
import {
  Box, Card, CardContent, Avatar, Typography, Button,
  Tabs, Tab, TextField, Chip, Stack, Divider, List, ListItem,
  ListItemIcon, ListItemText, Tooltip
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CakeIcon from "@mui/icons-material/Cake";
import WcIcon from "@mui/icons-material/Wc";
import DownloadIcon from "@mui/icons-material/Download";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

import {
  chipStyle, cardSx, cardContentSx, bigAvatarSx, tabsSx,
  textFieldSx, skillsBoxSx, pageContainerSx, headingSx,
  personCardWrapperSx
} from "../../Styles/about.sx.js";


/** ======= Data ======= */
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
    cv: "/franz_resume.pdf",
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
    email: "miranda.robin.t@gmail.com",
    dob: "August 17, 2003",
    gender: "♂︎",
    cv: "/cv-robin.pdf",
    skills: [
      "ReactJS","Material-UI","Node.js","Express","MongoDB","REST APIs","Axios",
      "Vite","React Router","HTML","CSS","Git","GitHub","Docker","CI/CD","Unit Testing",
      "Laravel", "Tailwind CSS", "Figma", "Selenium", "Robot Framework"
    ]
  }
];

function PersonCard({ p }) {
  const [tab, setTab] = useState(0);
  const [q, setQ] = useState("");
  const skills = useMemo(
    () => (!q ? p.skills : p.skills.filter((s) => s.toLowerCase().includes(q.toLowerCase()))),
    [p.skills, q]
  );

  return (
    <Card sx={cardSx}>
      <CardContent sx={cardContentSx}>
        <Stack alignItems="center" spacing={1.25} sx={{ pt: 1 }}>
          <Avatar sx={bigAvatarSx}>{p.initials}</Avatar>
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
          centered
          textColor="primary"
          indicatorColor="primary"
          sx={tabsSx}
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
                sx={textFieldSx}
              />
              <Typography variant="caption" sx={{ opacity: 0.8, whiteSpace: "nowrap" }}>
                {skills.length}/{p.skills.length}
              </Typography>
            </Stack>
            <Box sx={skillsBoxSx}>
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
    <Box sx={pageContainerSx}>
      <Typography variant="h4" sx={headingSx}>
        About the Developers
      </Typography>
      <Stack spacing={2.5} alignItems="center">
        {PEOPLE.map((p) => (
          <Box key={p.email} sx={personCardWrapperSx}>
            <PersonCard p={p} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
