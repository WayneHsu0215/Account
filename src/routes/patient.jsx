import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Patient = () => {
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



    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


// Inside your Root component
    const searchPatient = async () => {
        const { ID, PName, ExamineID, Examine, Diagnosis, DName } = searchParams;

        if (!ID && !PName && !ExamineID && !Examine && !Diagnosis && !DName && !startDate && !endDate) {
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
                startDate: startDate ? startDate.toISOString().split('T')[0] : '',
                endDate: endDate ? endDate.toISOString().split('T')[0] : '',
            }).toString();

            const response = await fetch(`/api/patientsearch?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            if (data.length === 0) {
                // Display a warning when search results are empty
                window.alert('未查詢符合資料');
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


        setStartDate(null);
        setEndDate(null);

        setSearchResults([]); // Set searchResults to an empty array


    };

    const clearAllFilters = () => {
        setSearchParams({
            ID: '',
            PName: '',
            ExamineID: '',
            Examine: '',
            Diagnosis: '',
            DName: '',
        });
        setStartDate(null);
        setEndDate(null);
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
            <h1 className="text-3xl font-semibold ml-4">Patient List</h1>
            <div className="flex justify-center items-center ">
                <div className="p-4 border border-black border-solid rounded-lg bg-slate-100 w-2/3">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 flex items-center">
                            <h1 className="text-l font-semibold w-24">身分證字號:</h1>
                            <input
                                className="border text-center rounded-lg border-black"
                                type="text"
                                placeholder="身分證字號"
                                value={searchParams.ID}
                                onChange={(e) => setSearchParams({ ...searchParams, ID: e.target.value })}
                            />
                        </div>
                        <div className="flex-1 flex items-center">
                            <h1 className="text-l font-semibold w-12">姓名:</h1>
                            <input
                                className="border text-center rounded-lg border-black"
                                type="text"
                                placeholder="姓名"
                                value={searchParams.PName}
                                onChange={(e) => setSearchParams({ ...searchParams, PName: e.target.value })}
                            />
                        </div>
                        <div className="flex-1 flex items-center">
                            <h1 className="text-l font-semibold w-20">檢查代碼:</h1>
                            <input
                                className="border text-center rounded-lg border-black "
                                type="text"
                                placeholder="檢查代碼"
                                value={searchParams.ExamineID}
                                onChange={(e) => setSearchParams({ ...searchParams, ExamineID: e.target.value })}
                            />
                        </div>
                        <div className="flex-1 flex items-center">
                            <h1 className="text-l font-semibold w-24">檢查名稱:</h1>
                            <input
                                className="border text-center rounded-lg border-black"
                                type="text"
                                placeholder="檢查名稱"
                                value={searchParams.Examine}
                                onChange={(e) => setSearchParams({ ...searchParams, Examine: e.target.value })}
                            />
                        </div>
                        <div className="flex-1 flex items-center">
                            <h1 className="text-l font-semibold w-12">診斷:</h1>
                            <input
                                className="border text-center rounded-lg border-black"
                                type="text"
                                placeholder="診斷"
                                value={searchParams.Diagnosis}
                                onChange={(e) => setSearchParams({ ...searchParams, Diagnosis: e.target.value })}
                            />
                        </div>
                        <div className="flex-1 flex items-center">
                            <h1 className="text-l font-semibold w-20">檢查醫生:</h1>
                            <input
                                className="border text-center rounded-lg border-black"
                                type="text"
                                placeholder="檢查醫生"
                                value={searchParams.DName}
                                onChange={(e) => setSearchParams({ ...searchParams, DName: e.target.value })}
                            />
                        </div>
                        <div className="flex-1 flex items-center">
                            <h1 className="text-l font-semibold w-28">檢查日期範圍:</h1>
                            {/* 开始日期选择器 */}
                            <DatePicker
                                placeholderText="選擇日期範圍"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="yyyy-MM-dd"
                                showYearDropdown // 启用年份下拉菜单
                                yearDropdownItemNumber={10}
                                showMonthDropdown
                                calendarIcon={<i className="fa fa-calendar" />}
                                clearIcon={<i className="fa fa-times" />}
                                maxDate={new Date()}
                                className="border text-center rounded-lg border-black w-32"
                            />
                        </div>
                        <div className="flex-1 flex items-center">
                            <h1 className="text-l font-semibold w-8">~</h1>
                            {/* 结束日期选择器 */}
                            <DatePicker
                                placeholderText="選擇日期範圍"
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                dateFormat="yyyy-MM-dd"
                                showYearDropdown // 启用年份下拉菜单
                                yearDropdownItemNumber={10}
                                showMonthDropdown
                                calendarIcon={<i className="fa fa-calendar" />}
                                clearIcon={<i className="fa fa-times" />}
                                maxDate={new Date()}
                                className="border text-center rounded-lg border-black w-32"
                            />
                        </div>
                        <div className="flex-1 flex justify-end items-center gap-4">
                            <button
                                className="h-8 rounded-lg text-black bg-amber-200 hover:bg-amber-400 w-20"
                                onClick={searchPatient}
                            >
                                查詢
                            </button>
                            <button
                                className="px-4 h-8 rounded-lg text-black bg-amber-200 hover:bg-amber-400 w-24"
                                onClick={clearAllFilters}
                            >
                                清空條件
                            </button>
                            <button
                                className="px-4 h-8 rounded-lg text-black bg-amber-200 hover:bg-amber-400 w-24"
                                onClick={showAllPatients}
                            >
                                顯示全部
                            </button>
                        </div>

                    </div>
                </div>
            </div>





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
            <div className="flex justify-end  mr-10 mt-4 h-full ">
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

export default Patient;