# Product Requirements Document (PRD)
## TriageFlow AI - NHS Patient Triage Management System

---

## Document Control

| **Field** | **Details** |
|-----------|-------------|
| **Product Name** | TriageFlow AI |
| **Version** | 1.0.0 |
| **Last Updated** | February 2026 |
| **Document Owner** | Product Team |
| **Status** | Active Development |

---

## 1. Executive Summary

### 1.1 Product Vision
TriageFlow AI is an AI-augmented workflow management system designed specifically for NHS healthcare operations. The platform optimizes the patient referral-to-treatment pathway by providing role-based digital workspaces for clinical and administrative staff, enhanced with AI-powered decision support.

### 1.2 Problem Statement
NHS clinical teams face significant challenges:
- **Manual Triage Bottlenecks**: Clinicians spend excessive time reviewing GP referral notes and patient histories
- **Fragmented Workflows**: Different staff personas (admin, clinicians, waiting list coordinators) lack integrated visibility
- **Safety Risks**: Critical information (e.g., anticoagulant medications) can be overlooked during rapid triage
- **Operational Blind Spots**: Management lacks real-time visibility into pathway bottlenecks and capacity constraints
- **Inconsistent Decision-Making**: Triage urgency assessments vary between clinicians

### 1.3 Solution Overview
TriageFlow AI provides:
1. **Four Role-Based Dashboards** tailored to specific NHS personas
2. **AI Clinical Decision Support** using OpenAI GPT-4o-mini for automated referral analysis
3. **Real-Time Workflow Orchestration** tracking patients through intake → triage → scheduling → confirmation
4. **Operational Analytics** providing management oversight of system performance and bottlenecks
5. **Safety Automation** with automatic detection of high-risk conditions (anticoagulants, urgent cases)

### 1.4 Success Metrics
- **Triage Time Reduction**: 40% decrease in average time per referral review
- **Safety Alert Detection**: 100% capture of anticoagulant medication flags
- **Booking Conversion Rate**: >85% from triage to confirmed appointment
- **User Adoption**: 90% of clinical staff actively using the system within 6 months
- **Wait Time Reduction**: 20% reduction in intake-to-treatment wait times

---

## 2. User Personas & Use Cases

### 2.1 Persona 1: Referral Admin ("The Gatekeeper")

**Role Description**: First point of contact for incoming GP referrals. Validates referral completeness and data quality before passing to clinical triage.

**Key Responsibilities**:
- Validate incoming GP referrals for completeness
- Check patient demographics and Medical Record Numbers (MRN)
- Ensure GP attachments and clinical narratives are present
- Forward validated referrals to triage queue
- Reject incomplete or invalid referrals

**Workflow**:
```
GP Referral → Intake Review → Validation → Triage Queue
```

**Dashboard Features**:
- **Validation Queue Table**: Lists all patients in "Intake Review" status
- **Quick Validation Actions**: One-click "Validate & Pass to Triage" button
- **Statistics Cards**:
  - Unprocessed referrals
  - Awaiting additional information
  - Triage-ready count
  - Rejected referrals
- **Search Functionality**: Filter by patient name or MRN
- **Verification Indicators**: Visual badges showing demographics verified, GP attachment present

**User Stories**:
- As a Referral Admin, I want to quickly see all pending referrals so I can prioritize my workload
- As a Referral Admin, I want to validate patient demographics are correct to prevent medical record errors
- As a Referral Admin, I want to pass validated referrals to clinicians so they can focus on clinical decisions

---

### 2.2 Persona 2: Clinician/Doctor ("The Decision Maker")

**Role Description**: Makes clinical triage decisions based on GP referral information. Uses AI decision support to analyze referrals and assign appropriate urgency levels and treatment pathways.

**Key Responsibilities**:
- Review patient GP notes and medical history
- Assess clinical urgency (Routine, Urgent, 2-Week Wait)
- Assign treatment pathways (Excision, Biopsy, Routine Clinic, 2WW Clinic)
- Identify safety concerns (anticoagulants, comorbidities)
- Use AI recommendations to inform (but not replace) clinical judgment

**Workflow**:
```
Triage Queue → AI Analysis → Clinical Review → Triage Decision → Waiting List
```

**Dashboard Features**:
- **Patient Profile Card**:
  - Full name, MRN, DOB, referral date
  - GP-suggested urgency level
  - Anticoagulant safety alerts (automatic)
- **Referral Interpretation Panel**:
  - GP clinical narrative
  - Patient comorbidities (visual tags)
  - Medical history
- **AI Decision Support**:
  - "AI Clinical Summary" generated on demand
  - Recommended urgency assessment
  - Suggested treatment pathway
  - Safety alerts
  - Powered by OpenAI GPT-4o-mini
- **Triage Action Buttons**:
  - Excision (See & Treat) - Urgent
  - 2WW Suspected Cancer - Priority
  - Routine Outpatient Clinic - Routine
- **Pre-Assessment Checklist**: Photos required, histopathology, GP summary verification
- **Clinician Attribution**: Records decision as "Signed as Dr. Sarah Wilson"

**AI Integration**:
- **Trigger**: Clinician clicks "AI Decision Support" button
- **Processing**:
  1. Sends patient data (GP note, history, comorbidities) to `/api/analyze`
  2. Backend calls OpenAI API with structured prompt
  3. Returns JSON response with clinical summary, urgency, pathway, safety alerts
- **Display**: Shows AI-generated insights in highlighted panel with recommendations
- **Safety**: API key secured server-side (Vercel serverless function)

**User Stories**:
- As a Clinician, I want to see AI-generated summaries of complex referrals so I can make faster decisions
- As a Clinician, I want automatic anticoagulant alerts so I never miss critical safety information
- As a Clinician, I want to assign patients to appropriate urgency categories so urgent cases are prioritized
- As a Clinician, I want to record my triage outcome so the waiting list team knows what to schedule

---

### 2.3 Persona 3: Waiting List Office ("The Orchestrator")

**Role Description**: Manages theatre scheduling and appointment booking for triaged patients. Coordinates available theatre capacity with patient urgency requirements.

**Key Responsibilities**:
- Schedule patients into available theatre slots
- Prioritize urgent cases for early scheduling
- Monitor theatre capacity and utilization
- Confirm patient appointments
- Sequence theatre lists for optimal efficiency

**Workflow**:
```
Triaged Patients → Find Theatre Slot → Schedule → Confirm Booking
```

**Dashboard Features**:
- **Ready to Schedule Table**:
  - Patient name, MRN
  - Required procedure (from clinician triage)
  - Clinical urgency level
  - "Find Slot" action button
- **Confirmed Bookings List**: Recent 24-hour confirmations with status badges
- **Theatre Load Panel**:
  - Real-time capacity visualization (3 theatres)
  - Percentage utilization with color-coded status
  - Critical capacity warnings (>90%)
- **Smart Sequencing Card**:
  - AI-powered theatre list optimization suggestions
  - "Auto-Sequence List" automation button
- **Action Buttons**:
  - Export Theatre Pack (PDF generation)
  - Open Theatre Slot (capacity management)

**User Stories**:
- As a List Coordinator, I want to see all patients ready for scheduling so I can book them efficiently
- As a List Coordinator, I want to see real-time theatre capacity so I can avoid overbooking
- As a List Coordinator, I want to prioritize urgent cases so patients receive timely treatment
- As a List Coordinator, I want to auto-sequence theatre lists so I maximize morning efficiency

---

### 2.4 Persona 4: Management ("The Overseer")

**Role Description**: Senior leadership with oversight responsibility. Monitors system-wide performance, identifies bottlenecks, and forecasts capacity needs.

**Key Responsibilities**:
- Monitor patient backlog volumes across all workflow stages
- Identify process bottlenecks (intake, triage, scheduling)
- Track booking conversion rates
- Forecast staffing and capacity requirements
- Review operational KPIs and trends

**Workflow**:
```
Real-Time Data → Analytics Dashboard → Insights → Strategic Decisions
```

**Dashboard Features**:
- **KPI Cards** (4 metrics):
  - Live Backlog: Total referrals in system
  - Triage Queue: Patients awaiting clinician review
  - Booking Rate: Percentage conversion from intake to confirmed
  - Urgent Cases: Number requiring <24h action
- **Pathway Volume Trend Chart**:
  - Area chart showing 5-day referral volume trend
  - Identifies influx patterns
- **Queue Distribution Bar Chart**:
  - Horizontal bars showing patients in each stage (Intake, Triage, Scheduling, Confirmed)
  - Color-coded by stage
  - Displays average wait time (4.1 days)
  - Highlights bottleneck stage (e.g., "Triage")
- **AI Operational Forecast**:
  - Predictive staffing recommendations
  - Example: "Based on current influx of 2 urgent cases, theatre suite B will require overflow staffing by Thursday 14:00"
  - "Authorize Staffing Bump" action button

**User Stories**:
- As a Management user, I want to see live backlog volumes so I can understand current system load
- As a Management user, I want to identify bottlenecks so I can allocate resources appropriately
- As a Management user, I want predictive staffing alerts so I can prevent capacity crises
- As a Management user, I want booking conversion metrics so I can measure pathway efficiency

---

## 3. Functional Requirements

### 3.1 Patient Data Model

**Core Patient Attributes**:
```typescript
interface Patient {
  id: string;                    // Unique identifier
  name: string;                  // Full name (format: "Last, First")
  dob: string;                   // Date of birth (DD/MM/YYYY)
  mrn: string;                   // Medical Record Number (format: MRN-XXXX-Y)
  referralDate: string;          // ISO date string
  urgency: 'Urgent' | 'Routine' | 'Inter Regular' | '2WW' | 'Not Set';
  status: PatientStatus;         // Workflow state
  gpNote: string;                // GP clinical narrative
  history: string;               // Medical history summary
  comorbidities: string[];       // Array of conditions
  procedure?: string;            // Assigned procedure (set by clinician)
  aiSummary?: string;            // AI-generated clinical summary
  aiRecommendation?: string;     // AI urgency/pathway recommendation
  lastUpdated?: string;          // ISO timestamp of last modification
}
```

**Patient Status Workflow**:
```
Intake Review → Triage Pending → Awaiting Scheduling → Scheduled → Confirmed → Rejected
```

### 3.2 AI Decision Support System

**Feature**: Automated clinical referral analysis using OpenAI GPT-4o-mini

**Technical Architecture**:
1. **Frontend Trigger**: User clicks "AI Decision Support" button in Clinician Dashboard
2. **API Request**:
   - Endpoint: `POST /api/analyze`
   - Payload: `{ patient: Patient }`
3. **Backend Processing** (`api/analyze.ts`):
   - Vercel serverless function
   - Constructs clinical prompt with patient data
   - Calls OpenAI Chat Completions API
   - Model: `gpt-4o-mini`
   - Response format: JSON object
   - Temperature: 0.3 (deterministic)
4. **AI Response Structure**:
```typescript
{
  summary: string;                    // Concise clinical summary
  urgencyRecommendation: string;      // "Urgent" | "Routine" | "Two-Week Wait"
  suggestedPathway: string;           // "Clinic" | "Biopsy" | "Surgery" | etc.
  safetyAlerts: string[];             // Array of safety warnings
}
```

**AI Prompt Engineering**:
- System role: "Clinical decision support assistant for NHS"
- User prompt includes:
  - Patient name
  - GP clinical note
  - Medical history
  - Comorbidities
- Instructions for:
  - Concise clinical summary
  - Safety-first urgency assessment
  - Suggested next steps
  - Safety warnings (medications, comorbidities)

**Security Requirements**:
- ✅ API key stored server-side only (`process.env.OPENAI_API_KEY`)
- ✅ No API key exposure in browser JavaScript
- ✅ Requests proxied through backend serverless function
- ✅ CORS headers configured for development

**User Experience**:
- Loading state: "Reading Notes..." with spinning icon
- Results display: Highlighted indigo panel with AI badge
- Shows: Summary, urgency recommendation, suggested pathway
- Clinician retains final decision authority

### 3.3 Safety Alert System

**Anticoagulant Detection**:
- **Trigger**: Automatic detection when patient comorbidities include:
  - "Warfarin"
  - "Anticoagulant" (case-insensitive)
- **Display**: Red alert banner on Clinician Dashboard
- **Content**:
  - Warning icon
  - "Anticoagulant Safety Alert" heading
  - "Patient on Warfarin. Requires INR check pre-op. Adjust procedure coding."
- **Purpose**: Prevent surgical complications from undetected anticoagulant use

### 3.4 Workflow State Management

**State Transitions**:

| **Current Status** | **Action** | **New Status** | **Actor** |
|-------------------|-----------|----------------|-----------|
| Intake Review | Validate & Pass to Triage | Triage Pending | Admin |
| Triage Pending | Triage Decision (any outcome) | Awaiting Scheduling | Clinician |
| Awaiting Scheduling | Find Slot | Confirmed | Waiting List |

**Toast Notifications**:
- Success messages appear for 3 seconds
- Examples:
  - "Referral for John Doe validated and sent to Triage"
  - "Patient Jane Smith triaged as Urgent. Outcome: Excision. Sent to List Office"
  - "Successfully scheduled Sarah Harrison for their BCC Excision"

### 3.5 Persona Switching

**User Journey**:
1. **Persona Selection Screen**:
   - Full-screen dark mode interface
   - Grid of 4 persona cards
   - Each card shows: Icon, Title, Subtitle, Description
2. **Persona Selection**: Click card to enter workspace
3. **Active Workspace**:
   - Sidebar with "Switch Persona" button
   - Navbar shows current persona title
4. **Switch Action**: Returns to persona selection screen

**Session Behavior**:
- No authentication required (demo mode)
- Persona state managed in React component state
- No persistence across page refreshes

### 3.6 Navigation & Layout

**Layout Structure**:
```
┌─────────────┬──────────────────────────────────┐
│   Sidebar   │          Navbar                  │
│   (72px)    ├──────────────────────────────────┤
│             │                                  │
│             │                                  │
│  - Logo     │        Dashboard Content         │
│  - Switch   │        (persona-specific)        │
│  - Queue/   │                                  │
│    Nav      │                                  │
│  - Status   │                                  │
└─────────────┴──────────────────────────────────┘
```

**Sidebar Features**:
- **Logo**: "TriageFlow AI" branding
- **Switch Persona Button**: Returns to selection screen
- **Contextual Content**:
  - **Clinician**: Patient queue with urgency badges
  - **Others**: Navigation menu (Dashboard, History, Settings)
- **System Health**: Status indicator ("All Systems Operational")

**Navbar Features**:
- Current persona title + "Dashboard"
- Notification bell icon (placeholder)
- User profile: "Dr. Sarah Wilson" with avatar

---

## 4. Non-Functional Requirements

### 4.1 Performance

| **Metric** | **Target** | **Critical Threshold** |
|-----------|------------|----------------------|
| Page Load Time | <2 seconds | <5 seconds |
| AI Analysis Time | <5 seconds | <10 seconds |
| Dashboard Render | <1 second | <3 seconds |
| API Response Time | <3 seconds | <8 seconds |

### 4.2 Security & Privacy

**Data Protection**:
- Mock patient data only (no real PHI/PII in current version)
- API keys secured server-side via environment variables
- No API key exposure in browser DevTools or JavaScript bundle
- Serverless functions for all external API calls

**Future Requirements** (Production):
- NHS Data Security and Protection Toolkit compliance
- GDPR compliance for patient data
- Role-based access control (RBAC)
- Audit logging of all patient data access
- Encryption at rest and in transit

### 4.3 Scalability

**Current Architecture**:
- Client-side React application
- Serverless backend (Vercel Functions)
- Stateless design (no database)

**Production Scaling Requirements**:
- Support 100+ concurrent users
- Handle 1,000+ patient records
- Database integration (PostgreSQL/MongoDB)
- Caching layer (Redis) for AI responses
- CDN for static assets

### 4.4 Accessibility

**WCAG 2.1 Level AA Compliance**:
- Color contrast ratios ≥4.5:1 for normal text
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators on interactive elements
- Semantic HTML structure

**Current Status**: Partial compliance (needs audit)

### 4.5 Browser Support

**Supported Browsers**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Mobile Support**: Responsive design (not optimized for mobile workflows)

### 4.6 Availability

**Uptime Target**: 99.5% (production)
**Deployment Platform**: Vercel
**Monitoring**: Required for production (e.g., Sentry, DataDog)

---

## 5. Technical Architecture

### 5.1 Technology Stack

**Frontend**:
- **Framework**: React 19.2.4
- **Language**: TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS (utility classes)
- **Charts**: Recharts 3.7.0

**Backend**:
- **Platform**: Vercel Serverless Functions
- **Runtime**: Node.js
- **AI Integration**: OpenAI SDK 4.77.0

**Development**:
- **Package Manager**: npm
- **Type Checking**: TypeScript strict mode
- **Version Control**: Git + GitHub

### 5.2 File Structure

```
triageflow-ai_01/
├── api/
│   └── analyze.ts              # Serverless function for AI analysis
├── components/
│   ├── AdminDashboard.tsx      # Referral Admin workspace
│   ├── ClinicianDashboard.tsx  # Clinician triage workspace
│   ├── ManagementDashboard.tsx # Management analytics workspace
│   ├── WaitingListDashboard.tsx# List coordinator workspace
│   ├── PersonaSelector.tsx     # Persona selection screen
│   ├── Sidebar.tsx             # Left navigation sidebar
│   └── Navbar.tsx              # Top navigation bar
├── services/
│   └── openaiService.ts        # Frontend API client
├── App.tsx                     # Root application component
├── constants.ts                # Mock data & persona config
├── types.ts                    # TypeScript type definitions
├── index.tsx                   # Application entry point
├── index.html                  # HTML template
├── vite.config.ts              # Vite build configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies & scripts
├── .env.local                  # Environment variables (git-ignored)
└── .gitignore                  # Git exclusions
```

### 5.3 Data Flow

**AI Analysis Flow**:
```
User Click → openaiService.ts → POST /api/analyze → analyze.ts
→ OpenAI API → GPT-4o-mini → JSON Response → Frontend Display
```

**State Management Flow**:
```
App.tsx (root state)
  ├── currentPersona
  ├── selectedPatientId
  ├── patients[] (MOCK_PATIENTS)
  └── toast (notifications)
       ↓
  Dashboard Components (props)
       ↓
  User Actions (callbacks)
       ↓
  State Updates (onUpdatePatient)
       ↓
  Re-render
```

### 5.4 API Endpoints

**Serverless Function**: `/api/analyze`

**Method**: `POST`

**Request Body**:
```json
{
  "patient": {
    "name": "Doe, John",
    "gpNote": "Presenting with suspicious lesion...",
    "history": "Previous melanoma excision...",
    "comorbidities": ["Hypertension", "Type 2 Diabetes", "Warfarin"]
  }
}
```

**Response** (200 OK):
```json
{
  "summary": "64-year-old male with concerning pigmented lesion on left arm showing ABCDE criteria changes...",
  "urgencyRecommendation": "Urgent",
  "suggestedPathway": "Two-Week Wait Dermatology",
  "safetyAlerts": [
    "Patient on warfarin - requires INR check pre-procedure",
    "Previous melanoma history - high recurrence risk"
  ]
}
```

**Error Response** (500):
```json
{
  "error": "Analysis failed",
  "message": "OpenAI API error details"
}
```

### 5.5 Environment Variables

**Development** (`.env.local`):
```
OPENAI_API_KEY=sk-...
```

**Production** (Vercel Environment Variables):
```
OPENAI_API_KEY=sk-... (secret)
```

### 5.6 Deployment

**Platform**: Vercel

**Build Configuration**:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x

**Deployment Steps**:
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy main branch
4. Automatic deployments on git push

**Production URL**: TBD (will be `*.vercel.app`)

---

## 6. User Interface Design

### 6.1 Design System

**Color Palette**:
- **Primary Blue**: `#3b82f6` (NHS blue, actions)
- **Urgent Red**: `#dc2626` (urgent cases, alerts)
- **Success Green**: `#10b981` (confirmations, completed)
- **Warning Amber**: `#f59e0b` (intermediate urgency)
- **Neutral Slate**: `#64748b` (text, borders)
- **Background**: `#f8fafc` (page background)
- **Dark**: `#0f172a` (persona selector, accents)

**Typography**:
- **Font Family**: System fonts (default sans-serif stack)
- **Headings**: Bold, uppercase tracking for labels
- **Body**: Regular weight, 14px base size
- **Small Text**: 10-12px for metadata, badges

**Component Library**:
- Custom-built components (no external UI library)
- Tailwind CSS utility classes
- Consistent spacing scale (4px base unit)

### 6.2 Key UI Patterns

**Cards**: White background, subtle border, rounded corners
**Badges**: Colored pills with uppercase text
**Buttons**:
  - Primary: Blue background, white text, shadow
  - Secondary: White background, border, slate text
  - Danger: Red background, white text
**Tables**: Zebra striping, hover states, compact rows
**Charts**: Recharts with custom color schemes
**Alerts**: Colored background panel with icon
**Toast Notifications**: Fixed top-right, auto-dismiss 3s

### 6.3 Responsive Behavior

**Breakpoints**:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px

**Layout Adaptations**:
- Sidebar: Fixed width (288px) on desktop
- Grid columns: 1 → 2 → 3 → 4 based on breakpoint
- Tables: Horizontal scroll on mobile
- Cards: Stack vertically on small screens

---

## 7. Testing Requirements

### 7.1 Unit Testing

**Target Coverage**: 70%+

**Test Cases**:
- Patient state updates
- AI response parsing
- Status transition logic
- Anticoagulant detection
- Metric calculations

**Framework**: Jest + React Testing Library

### 7.2 Integration Testing

**Test Scenarios**:
- Full triage workflow (Admin → Clinician → Waiting List)
- AI analysis end-to-end
- Persona switching
- Toast notifications

### 7.3 User Acceptance Testing

**UAT Scenarios**:
1. Admin validates 5 referrals and passes to triage
2. Clinician uses AI to triage urgent melanoma case
3. Waiting List schedules patient into theatre slot
4. Management reviews backlog and identifies bottleneck
5. Safety alert displays correctly for anticoagulant patient

**Acceptance Criteria**: 90% UAT pass rate

### 7.4 Security Testing

**Penetration Testing**:
- Verify API key not exposed in browser
- Test CORS policy enforcement
- Validate input sanitization

**Compliance Testing**:
- OWASP Top 10 vulnerability scan
- Data protection audit

---

## 8. Analytics & Monitoring

### 8.1 Product Analytics

**Key Events to Track**:
- Persona selection
- Patient viewed
- AI analysis triggered
- Triage decision recorded
- Patient status changed
- Dashboard viewed (by persona)

**Metrics Dashboard**:
- Daily/weekly active users
- Average triage time
- AI usage rate
- Conversion funnel (intake → confirmed)
- Feature adoption by persona

**Tool Recommendation**: Mixpanel or Amplitude

### 8.2 Technical Monitoring

**Application Monitoring**:
- Error tracking (Sentry)
- API response times
- AI analysis latency
- Page load performance

**Infrastructure Monitoring**:
- Vercel function execution time
- OpenAI API usage & costs
- Serverless function errors

### 8.3 User Feedback

**In-App Feedback**:
- Feedback widget (Canny, UserVoice)
- Net Promoter Score (NPS) surveys
- Feature request submission

---

## 9. Compliance & Regulatory

### 9.1 NHS Requirements

**Data Security**:
- NHS Data Security and Protection Toolkit registration (production)
- IG Toolkit compliance assessment
- Information Governance training for team

**Clinical Safety**:
- DCB0129 Clinical Safety Officer assignment
- DCB0160 Clinical Risk Management compliance
- Hazard log maintenance
- Clinical safety case report

**Interoperability**:
- HL7 FHIR readiness (future)
- NHS Number validation (future)
- Integration with NHS Spine (future)

### 9.2 GDPR Compliance

**Data Protection**:
- Privacy Impact Assessment (PIA)
- Data Processing Agreement with OpenAI
- Patient consent mechanisms
- Right to erasure implementation
- Data retention policies (7 years clinical data)

### 9.3 Medical Device Classification

**Current Status**: Not classified as medical device (decision support tool)
**Justification**: Clinician retains final decision authority; AI provides recommendations only
**Future Review**: Required if AI autonomy increases

---

## 10. Roadmap & Future Enhancements

### 10.1 Phase 1: MVP (Current)
✅ Four persona dashboards
✅ AI clinical decision support
✅ Basic workflow orchestration
✅ Safety alerts (anticoagulant)
✅ Mock data demonstration

### 10.2 Phase 2: Production Readiness (Q2 2026)
- Database integration (PostgreSQL)
- User authentication & RBAC
- Real patient data integration
- Audit logging
- NHS SSO integration (NHS Identity)
- Production security hardening

### 10.3 Phase 3: Enhanced AI (Q3 2026)
- Multi-language support (Welsh, Polish)
- Voice-to-text GP note transcription
- AI-powered triage priority scoring
- Predictive wait time estimation
- Smart theatre slot recommendation engine

### 10.4 Phase 4: Integrations (Q4 2026)
- Electronic Health Record (EHR) integration
- NHS e-Referral Service (e-RS) sync
- PACS imaging integration
- Email/SMS patient notifications
- GP feedback loop (outcome reporting)

### 10.5 Phase 5: Advanced Analytics (Q1 2027)
- ML-based bottleneck prediction
- Capacity planning AI
- Quality outcome tracking
- Comparative effectiveness analysis
- Population health insights

---

## 11. Dependencies & Assumptions

### 11.1 Technical Dependencies

**External Services**:
- OpenAI API availability (99.9% SLA)
- Vercel platform uptime
- GitHub repository access

**Third-Party Libraries**:
- React ecosystem stability
- OpenAI SDK compatibility
- Recharts chart library

### 11.2 Organizational Dependencies

**NHS Stakeholders**:
- Clinical governance approval
- Information Governance sign-off
- IT department infrastructure support
- Procurement approval for OpenAI contract

### 11.3 Assumptions

**Business Assumptions**:
- NHS staff have basic computer literacy
- Stable internet connectivity in clinical areas
- Willingness to adopt AI decision support
- Management support for workflow changes

**Technical Assumptions**:
- Modern browser availability
- Desktop/laptop primary device (not mobile)
- English language primary use case
- Serverless architecture suitable for NHS scale

**Data Assumptions**:
- GP referrals available in digital format
- Patient demographics accessible
- Comorbidity data standardized

---

## 12. Success Criteria & KPIs

### 12.1 Adoption Metrics

| **Metric** | **Target (6 months)** | **Measurement** |
|-----------|----------------------|-----------------|
| Active Users | 90% of clinical staff | Weekly active users |
| Triage Completion Rate | 85%+ of referrals | Status = "Confirmed" |
| AI Feature Usage | 60%+ of triages | AI button clicks |
| Persona Adoption | All 4 personas used | Dashboard views |

### 12.2 Efficiency Metrics

| **Metric** | **Baseline** | **Target** | **Impact** |
|-----------|--------------|-----------|-----------|
| Avg Triage Time | 12 min | 7 min | 40% reduction |
| Intake to Confirmed | 6.2 days | 5.0 days | 20% reduction |
| Daily Triage Capacity | 40 cases | 60 cases | 50% increase |
| Admin Processing Time | 5 min/referral | 3 min/referral | 40% reduction |

### 12.3 Quality Metrics

| **Metric** | **Target** | **Measurement** |
|-----------|-----------|----------------|
| Triage Accuracy | 95%+ | Clinical audit |
| Safety Alert Detection | 100% | Automated capture |
| Booking Error Rate | <2% | Wrong slot/procedure |
| User Satisfaction (NPS) | 50+ | Quarterly survey |

### 12.4 Financial Metrics

| **Metric** | **Target** | **ROI** |
|-----------|-----------|---------|
| OpenAI API Cost | <£500/month | Cost per triage <£0.10 |
| Staff Time Savings | 200 hours/month | £6,000/month @ £30/hr |
| Patient Wait Time Value | 20% reduction | Improved clinical outcomes |

---

## 13. Risks & Mitigation

### 13.1 Technical Risks

| **Risk** | **Impact** | **Probability** | **Mitigation** |
|---------|-----------|----------------|----------------|
| OpenAI API outage | High | Low | Fallback to manual triage; cache responses |
| API key exposure | Critical | Very Low | Server-side functions; security audit |
| Slow AI response time | Medium | Medium | Set timeout limits; optimize prompts |
| Browser incompatibility | Low | Low | Test across browsers; polyfills |

### 13.2 Organizational Risks

| **Risk** | **Impact** | **Probability** | **Mitigation** |
|---------|-----------|----------------|----------------|
| Clinical staff resistance | High | Medium | Training; demonstrate time savings |
| Regulatory non-approval | Critical | Low | Early IG/safety engagement |
| Budget constraints | Medium | Medium | Phased rollout; demonstrate ROI |
| Data privacy breach | Critical | Very Low | Security audit; GDPR compliance |

### 13.3 Clinical Risks

| **Risk** | **Impact** | **Probability** | **Mitigation** |
|---------|-----------|----------------|----------------|
| AI misdiagnosis | Critical | Low | Clinician final authority; AI as support only |
| Over-reliance on AI | High | Medium | Training; clinical judgment emphasis |
| Missed safety alerts | Critical | Very Low | Automated detection; redundant checks |
| Incorrect triage priority | High | Low | AI validation; clinical oversight |

---

## 14. Appendices

### 14.1 Glossary

| **Term** | **Definition** |
|---------|---------------|
| **2WW** | Two-Week Wait - NHS cancer referral pathway requiring appointment within 14 days |
| **MRN** | Medical Record Number - unique patient identifier |
| **GP** | General Practitioner - primary care physician |
| **INR** | International Normalized Ratio - blood clotting test for anticoagulant monitoring |
| **Triage** | Clinical assessment to determine urgency and treatment priority |
| **Theatre** | Operating theatre/surgical suite |
| **Excision** | Surgical removal of tissue/lesion |
| **Comorbidity** | Co-existing medical conditions |

### 14.2 Mock Data Summary

**Current Mock Patients**: 6 test cases

**Status Distribution**:
- Intake Review: 2 patients
- Triage Pending: 2 patients
- Awaiting Scheduling: 1 patient
- Confirmed: 1 patient

**Urgency Distribution**:
- Urgent: 2 patients
- Routine: 2 patients
- Inter Regular: 1 patient
- Not Set: 1 patient

**Medical Scenarios**:
- Melanoma surveillance
- Sebaceous cyst removal
- Atypical mole assessment
- Basal Cell Carcinoma excision
- Lipoma removal
- Minor skin tag removal

### 14.3 Related Documentation

- Technical Architecture Diagram (TBD)
- API Documentation (Swagger/OpenAPI) (TBD)
- User Manual (TBD)
- Training Materials (TBD)
- Clinical Safety Case Report (TBD)
- Data Flow Diagram (TBD)

### 14.4 Version History

| **Version** | **Date** | **Author** | **Changes** |
|------------|---------|-----------|------------|
| 1.0.0 | Feb 2026 | Product Team | Initial PRD based on codebase analysis |

---

## 15. Approval & Sign-Off

| **Role** | **Name** | **Signature** | **Date** |
|---------|---------|--------------|---------|
| Product Owner | TBD | _______________ | _______ |
| Technical Lead | TBD | _______________ | _______ |
| Clinical Lead | TBD | _______________ | _______ |
| Information Governance | TBD | _______________ | _______ |
| Clinical Safety Officer | TBD | _______________ | _______ |

---

**Document End**
