
USE master
-- 檢查資料庫是否存在
IF DB_ID ( 'BANK' ) IS NOT NULL
  DROP DATABASE BANK;
GO
-- 新建資料庫
CREATE DATABASE BANK
    COLLATE Chinese_PRC_CI_AS;
GO



-- 新建資料表
USE BANK;

-- 新增用戶資料Table: Customer
CREATE TABLE Customer
(
    ID int,
    PWD varbinary(max),
    LName varchar(20),
    FName varchar(20),
    BDate date,
    Sex char(1),
    Address varchar(50),
    City varchar(20),
    Country varchar(50),
    UP_Date datetime,
    UP_User varchar(20)
        PRIMARY KEY (ID)
)
    GO

DECLARE @CURRENT_TS datetimeoffset = GETDATE()
INSERT INTO Customer
  (ID, PWD, Lname,FName,BDate,Sex,Address,City,Country,UP_Date,UP_User)
VALUES('0', HASHBYTES('SHA2_512',N'123'),'CY', 'Lien', '19120101', 'M', 'Neihu', 'Taipei', 'Taiwan', @CURRENT_TS, '0');
INSERT INTO Customer
(ID, PWD,Lname,FName,BDate,Sex,Address,City,Country,UP_Date,UP_User)
VALUES('001', HASHBYTES('SHA2_512',N'123'),'LJ', 'KUO', '19981002', 'F', 'Neihu', 'Taipei', 'Taiwan', @CURRENT_TS, '0');
INSERT INTO Customer
(ID, PWD, Lname,FName,BDate,Sex,Address,City,Country,UP_Date,UP_User)
VALUES('002', HASHBYTES('SHA2_512',N'123'), 'CW', 'Lin', '19981002', 'F', 'Tianmu', 'Taipei', 'Taiwan', @CURRENT_TS, '0');
INSERT INTO Customer
(ID, PWD, Lname,FName,BDate,Sex,Address,City,Country,UP_Date,UP_User)
VALUES('003', HASHBYTES('SHA2_512',N'123'), 'DW', 'Wang', '19981002', 'M', 'Beitou', 'Taipei', 'Taiwan', @CURRENT_TS, '0');
GO
-- drop TABLE Account
CREATE TABLE Account
(
    ID int PRIMARY KEY,
    AccID varchar(10) UNIQUE,
    Password varchar(100),
    AccType varchar(3),
    UP_Date datetime DEFAULT GETDATE(),
    UP_User varchar(20)
);
-- 插入测试数据（只有帐号 "admin" 的记录）

INSERT INTO ACCOUNT
(ID,AccID, Password,  AccType, UP_User)
VALUES
    (1,'admin', 'admin','0', '0');
GO

CREATE TRIGGER CHECK_DEL_ACC
    ON Account
    INSTEAD OF DELETE
    AS
    IF(SELECT ID FROM deleted) = 1
        BEGIN
            PRINT '不可刪除管理者！'
            ROLLBACK
        END
    ELSE
        BEGIN
            DELETE FROM Account
            WHERE ID IN (SELECT ID FROM deleted)
        END
GO

select * from Account


-- 新增交易紀錄Table: Trans
CREATE TABLE Trans
(
    AccID varchar(10),
    TranID int IDENTITY(1,1) PRIMARY KEY,
    TranTime datetime DEFAULT GETDATE(),
    AtmID varchar(3),
    TranType varchar(3),
    TranNote varchar(100),
    UP_DATETIME datetime DEFAULT GETDATE(),
    UP_USR varchar(20)
)
    GO

INSERT INTO Trans (AccID, AtmID, TranType, TranNote, UP_USR)
VALUES
    ('1234567890',  '001', 'DEP', '測試', 'User1'),
    ('1234567891',  '002', 'WDR', 'Withdraw Money', 'User2'),
    ('1234567892',  '003', 'DEP', 'Deposit Money', 'User3'),
    ('1234567893',  '001', 'WDR', 'Withdraw Money', 'User4'),
    ('1234567894',  '002', 'DEP', 'Deposit Money', 'User5'),
    ('1234567895',  '003', 'WDR', 'Withdraw Money', 'User6'),
    ('1234567896',  '001', 'DEP', 'Deposit Money', 'User7'),
    ('1234567897',  '002', 'WDR', 'Withdraw Money', 'User8'),
    ('1234567898',  '003', 'DEP', 'Deposit Money', 'User9'),
    ('1234567899',  '001', 'WDR', 'Withdraw Money', 'User10');
GO

-- Create Table LOG_SEQ
CREATE TABLE LOG_SEQ(
                        SDATE varchar(8) NOT NULL PRIMARY KEY, -- 當天的log紀錄
                        LOG_COUNT varchar(6) NOT NULL --當天一共有多少筆log
)
    GO

-- 新增patient資料Table: Patient
CREATE TABLE Patient
(
    NID int IDENTITY(1,1) PRIMARY KEY,
    ID varchar(10) ,
    PName varchar(20),
    PGender char(1),
    PBirth date,
    PAge int,
    Examinedate datetime DEFAULT GETDATE(),
    ExamineID varchar(20),
    Examine varchar(50),
    PPay varchar(20),
    Diagnosis varchar(20),
    DName varchar(20),
    type varchar(20)
)
GO

-- 插入第1笔患者数据
INSERT INTO Patient (ID, PName, PGender, PBirth, PAge, ExamineID, Examine, PPay, Diagnosis, DName, type)
VALUES ('A123456789', 'John Doe', 'M', '1990-01-15', DATEDIFF(YEAR, '1990-01-15', GETDATE()), 'E001', 'Routine Checkup', 'Cash', 'Healthy', 'Dr. Smith', 'General'),
       ('B123456789', 'Jane Smith', 'F', '1985-05-20', DATEDIFF(YEAR, '1985-05-20', GETDATE()), 'E002', 'Blood Test', 'Insurance', 'Anemia', 'Dr. Johnson', 'Specialist'),
       ('C123456789', 'Mike Johnson', 'M', '1988-11-10', DATEDIFF(YEAR, '1988-11-10', GETDATE()), 'E003', 'X-ray', 'Credit Card', 'Fracture', 'Dr. Brown', 'General'),
       ('D123456789', 'Emily Davis', 'F', '1995-08-03', DATEDIFF(YEAR, '1995-08-03', GETDATE()), 'E004', 'Ultrasound', 'Cash', 'Pregnant', 'Dr. White', 'Obstetrics'),
       ('E123456789', 'David Wilson', 'M', '1982-04-25', DATEDIFF(YEAR, '1982-04-25', GETDATE()), 'E005', 'MRI', 'Insurance', 'Back Pain', 'Dr. Taylor', 'Specialist'),
       ('F123456789', 'Linda Lee', 'F', '1998-12-15', DATEDIFF(YEAR, '1998-12-15', GETDATE()), 'E006', 'Physical Exam', 'Cash', 'General Checkup', 'Dr. Smith', 'General'),
       ('G123456789', 'Robert Brown', 'M', '1991-06-30', DATEDIFF(YEAR, '1991-06-30', GETDATE()), 'E007', 'CT Scan', 'Credit Card', 'Headache', 'Dr. Johnson', 'Specialist'),
       ('H123456789', 'Susan Miller', 'F', '1980-09-18', DATEDIFF(YEAR, '1980-09-18', GETDATE()), 'E008', 'EKG', 'Insurance', 'Heart Condition', 'Dr. White', 'Cardiology'),
       ('I123456789', 'James Clark', 'M', '1987-03-08', DATEDIFF(YEAR, '1987-03-08', GETDATE()), 'E009', 'Blood Pressure Check', 'Cash', 'Hypertension', 'Dr. Brown', 'General'),
       ('J123456789', 'Karen Anderson', 'F', '1993-07-12', DATEDIFF(YEAR, '1993-07-12', GETDATE()), 'E010', 'Dental Checkup', 'Credit Card', 'Toothache', 'Dr. Taylor', 'Dentistry'),
       ('K123456789', 'Anderson', 'F', '1993-07-12', DATEDIFF(YEAR, '1993-07-12', GETDATE()), 'E010', 'Dental Checkup', 'Credit Card', 'Toothache', 'Dr. Taylor', 'Dentistry'),
       ('A123456789', 'John Doe', 'M', '1990-01-15', DATEDIFF(YEAR, '1990-01-15', GETDATE()), 'E002', 'Blood Test', 'Insurance', 'Anemia', 'Dr. Johnson', 'Specialist');
GO
INSERT INTO Patient (ID, PName, PGender, PBirth, PAge,Examinedate ,ExamineID, Examine, PPay, Diagnosis, DName, type)
VALUES ('D123456789', 'Emily Davis', 'F', '1995-08-03', DATEDIFF(YEAR, '1990-01-15', GETDATE()),'2023-08-03' ,'E001', 'Routine Checkup', 'Cash', 'Healthy', 'Dr. Smith', 'General');

SELECT * FROM Patient

SELECT * FROM LOG_SEQ
SELECT * FROM Customer
SELECT * FROM Account
SELECT * FROM Trans

SELECT AccID, TranID, CONVERT(varchar, TranTime, 23) AS TranTime, AtmID, TranType, TranNote, CONVERT(varchar, UP_DATETIME, 23) AS UP_DATETIME, UP_USR
FROM Trans;

SELECT AccID FROM Account;

SELECT AccID,Password FROM Account WHERE AccID = 'admin' AND Password = 'admin';

SELECT ID, PName, PGender, CONVERT(VARCHAR(10), PBirth, 126) as PBirth, PAge, CONVERT(varchar, Examinedate, 23) AS Examinedate, ExamineID, Examine, PPay, Diagnosis, DName, type
            FROM Patient

