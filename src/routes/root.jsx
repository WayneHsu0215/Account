import React, { useEffect, useState } from 'react';

const Root = () => {
    const [patient, setPatient] = useState([]);
    const [searchParams, setSearchParams] = useState({
        ID: '',
        PName: '',
        ExamineID: '',
        Examine: '',
        Diagnosis: '',
        DName: '',
    });
    const [searchResults, setSearchResults] = useState([]);
    const [allPatientData, setAllPatientData] = useState([]);

    const fetchPatientData = async () => {
        try {
            const response = await fetch('/api/patient');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setPatient(data);
            setAllPatientData(data); // Store the original data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchPatientData();
    }, []);

// Inside your Root component
    const searchPatient = async () => {
        const { ID, PName, ExamineID, Examine, Diagnosis, DName } = searchParams;

        if (!ID && !PName && !ExamineID && !Examine && !Diagnosis && !DName) {
            return; // No search parameters provided
        }

        try {
            const queryParams = new URLSearchParams({
                ID,
                PName,
                ExamineID,
                Examine,
                Diagnosis,
                DName,
            }).toString();

            const response = await fetch(`/api/patientsearch?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            if (data.length === 0) {
                // Display a warning when search results are empty
                window.alert('查符合和資料');
            }

            setSearchResults(data);
        } catch (error) {
            console.error('Error searching patient:', error);
        }
    };


    const showAllPatients = () => {
        setSearchParams({
            ID: '',
            PName: '',
            ExamineID: '',
            Examine: '',
            Diagnosis: '',
            DName: '',
        });
        setSearchResults([]); // Set searchResults to an empty array


    };

    const [currentPage, setCurrentPage] = useState(1);
    const patientPerPage = 10;
    const indexOfLastpatient = currentPage * patientPerPage;
    const indexOfFirspatient = indexOfLastpatient - patientPerPage;
    const currentpatient = patient.slice(indexOfFirspatient, indexOfLastpatient);


    const handlePageInputChange = (e) => {
        const value = e.target.value;
        const maxPage = Math.ceil(patient.length / patientPerPage);
        if (value === "" || (Number(value) > 0 && !isNaN(value) && value <= maxPage)) {
            setCurrentPage(value === "" ? "" : parseInt(value));
        } else {
            // 如果输入无效、为负数或大于最大页数，将当前页设置为1
            setCurrentPage(1);
        }
    };






    const nextPage = () => {
        if (currentPage < Math.ceil(patient.length / patientPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }else if(currentPage < 1)
        {
            setCurrentPage(1);
        }
    };



    return (
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 ">
            <h1 className="text-3xl font-semibold mb-4 m-6">Patient List</h1>

            <div className="flex flex-col md:flex-row justify-center items-center">
                <input
                    className="border text-center m-2 rounded-lg border-black"
                    type="text"
                    placeholder="身分證字號"
                    value={searchParams.ID}
                    onChange={(e) => setSearchParams({ ...searchParams, ID: e.target.value })}
                />
                <input
                    className="border text-center m-2 rounded-lg border-black"
                    type="text"
                    placeholder="姓名"
                    value={searchParams.PName}
                    onChange={(e) => setSearchParams({ ...searchParams, PName: e.target.value })}
                />
                <input
                    className="border text-center m-2 rounded-lg border-black"
                    type="text"
                    placeholder="檢查代碼"
                    value={searchParams.ExamineID}
                    onChange={(e) => setSearchParams({ ...searchParams, ExamineID: e.target.value })}
                />
                <input
                    className="border text-center m-2 rounded-lg border-black"
                    type="text"
                    placeholder="檢查名稱"
                    value={searchParams.Examine}
                    onChange={(e) => setSearchParams({ ...searchParams, Examine: e.target.value })}
                />
                <input
                    className="border text-center m-2 rounded-lg border-black"
                    type="text"
                    placeholder="診斷"
                    value={searchParams.Diagnosis}
                    onChange={(e) => setSearchParams({ ...searchParams, Diagnosis: e.target.value })}
                />
                <input
                    className="border text-center m-2 rounded-lg border-black"
                    type="text"
                    placeholder="檢查醫生"
                    value={searchParams.DName}
                    onChange={(e) => setSearchParams({ ...searchParams, DName: e.target.value })}
                />

            </div>
            <div className="flex flex-col md:flex-row justify-center items-center">
                <button
                    className="px-4 h-8 rounded-lg m-2 text-black bg-amber-200 hover:bg-amber-400"
                    onClick={searchPatient}
                >
                    查詢
                </button>
                <button
                    className="px-4 h-8 rounded-lg text-black bg-amber-200 hover:bg-amber-400"
                    onClick={showAllPatients}
                >
                    顯示全部
                </button></div>


            <div className="h-96 overflow-y-scroll mt-4 ">
                <table className="min-w-full border-2">
                    <thead>
                    <tr>
                        <th className="px-2 py-2 ">編號</th>
                        <th className="px-4 py-2 ">身分證字號</th>
                        <th className="px-4 py-2 ">姓名</th>
                        <th className="px-4 py-2 w-16">性別</th>
                        <th className="px-4 py-2 ">出生日期</th>
                        <th className="px-4 py-2 w-16">年齡</th>
                        <th className="px-4 py-2 ">檢查日期</th>
                        <th className="px-4 py-2 w-32">檢查代碼</th>
                        <th className="px-4 py-2 ">檢查名稱</th>
                        <th className="px-4 py-2 ">費別</th>
                        <th className="px-4 py-2 ">診斷</th>
                        <th className="px-4 py-2 w-28">檢查醫生</th>
                        <th className="px-4 py-2 ">診別</th>
                    </tr>
                    </thead>
                    <tbody>
                    {searchResults.length > 0 ? (
                        searchResults.map((result) => (
                            <tr key={result.NID}>
                                <td className="border px-4 py-2">{result.NID}</td>
                                <td className="border px-4 py-2">{result.ID}</td>
                                <td className="border px-4 py-2">{result.PName}</td>
                                <td className="border px-4 py-2">{result.PGender}</td>
                                <td className="border px-4 py-2">{result.PBirth}</td>
                                <td className="border px-4 py-2">{result.PAge}</td>
                                <td className="border px-4 py-2">{result.Examinedate}</td>
                                <td className="border px-4 py-2">{result.ExamineID}</td>
                                <td className="border px-4 py-2">{result.Examine}</td>
                                <td className="border px-4 py-2">{result.PPay}</td>
                                <td className="border px-4 py-2">{result.Diagnosis}</td>
                                <td className="border px-4 py-2">{result.DName}</td>
                                <td className="border px-4 py-2">{result.type}</td>
                            </tr>
                        ))
                    ) : (
                        currentpatient.map((patient) => (
                            <tr key={patient.NID}>
                                <td className="border px-4 py-2">{patient.NID}</td>
                                <td className="border px-4 py-2">{patient.ID}</td>
                                <td className="border px-4 py-2">{patient.PName}</td>
                                <td className="border px-4 py-2">{patient.PGender}</td>
                                <td className="border px-4 py-2">{patient.PBirth}</td>
                                <td className="border px-4 py-2">{patient.PAge}</td>
                                <td className="border px-4 py-2">{patient.Examinedate}</td>
                                <td className="border px-4 py-2">{patient.ExamineID}</td>
                                <td className="border px-4 py-2">{patient.Examine}</td>
                                <td className="border px-4 py-2">{patient.PPay}</td>
                                <td className="border px-4 py-2">{patient.Diagnosis}</td>
                                <td className="border px-4 py-2">{patient.DName}</td>
                                <td className="border px-4 py-2">{patient.type}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
            {/*分頁*/}
            <div className="flex justify-end  mr-10 mt-4 ">
                <button onClick={prevPage} disabled={currentPage === 1} className="mr-4">
                    上一頁
                </button>

                <input
                    type="number"
                    value={currentPage}
                    onChange={(e) => handlePageInputChange(e)}
                    className="border border-black text-center w-14 rounded-lg mr-4"
                />

                <button onClick={nextPage} disabled={currentPage === Math.ceil(patient.length / patientPerPage)}>
                    下一頁
                </button>
            </div>


        </div>
    );
};

export default Root;