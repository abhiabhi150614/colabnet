
#ColabNet  
A platform designed for seamless collaboration on projects, where users can share, discover, and contribute to project ideas. Once a project team is complete, users can apply for funding through the platform. Funders can review and approve funding requests with transparency.

---

## Features
- Project Sharing:  
  - Users can post their project ideas publicly.  
  - Other users can view and join project ideas shared by others.  
   
- Home Page  
  - Displays projects shared by other users for easy discovery.  

- Team Completion & Funding:  
  - Once a project team is complete, users can apply for funding.  
  - Funders can review funding requests and either accept or reject them based on the details provided.  
  - Funding requests must include the required amount, or they will be rejected.  

---

## Technology Stack  

- **Frontend**: React.js  
- **Backend**: Node.js with Express.js  
- **Database**: SQL  

---

## **Sample Login Credentials**  

### **Students**  
| **ID** | **Name**  | **Password** | **Role**   |  
|--------|-----------|--------------|------------|  
| 1      | User1     | password1    | Student    |  
| 2      | User2     | password2    | Student    |  
| 3      | User3     | password3    | Student    |  
| 4      | User4     | password4    | Student    |  

### **Funder**  
| **ID** | **Name**  | **Password** | **Role**   |  
|--------|-----------|--------------|------------|  
| 5      | Funder    | funderpass   | Funder     |  

---

## **How to Use**  

1. **Login**:  
   Use the provided sample credentials or create your own account.  

2. **Post a Project Idea**:  
   - Navigate to the project submission section.  
   - Share your project idea, which will be visible to other users on their home page.  

3. **Explore Projects**:  
   - Browse the home page to find projects shared by others.  
   - Join projects that align with your skills and interests.  

4. **Funding Requests**:  
   - Once your team is complete, submit a funding request.  
   - Ensure the funding amount is mentioned in your request.  

5. **Funder Review**:  
   - Funders can log in to review requests and accept or reject them.  

---

## **How to Run Locally**  

1. Clone the repository:  
   ```bash  
   git clone https://github.com/your-repo-name/ColabNet.git  
   cd ColabNet  
   ```  

2. Install dependencies for both frontend and backend:  
   ```bash  
   cd frontend  
   npm install  
   cd ../backend  
   npm install  
   ```  

3. Set up the database:  
   - Ensure you have an SQL server running.  
   - Import the provided database schema (`db_schema.sql`).  

4. Start the development servers:  
   - **Frontend**:  
     ```bash  
     cd frontend  
     npm start  
     ```  
   - **Backend**:  
     ```bash  
     cd backend  
     npm start  
     ```  

5. Access the app in your browser at `http://localhost:3000`.  

