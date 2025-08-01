import { useEffect, useState } from "react";
import "./Info.css";
import { useNavigate } from "react-router-dom";
import { getEmergencyContact } from "../../api/member";

const Info = () => {

    const BACKEND = import.meta.env.VITE_BACKEND_URL;

    //const [userList, setUserList] = useState([]);

const login = async (nickname, password) => {
  const formData = new FormData();
  formData.append("nickname", nickname);  // 서버 요구 사항 확인!
  formData.append("password", password);

  try {
    const res = await fetch(`${BACKEND}/api/login`, {
      method: "POST",
      body: formData,
      credentials: "include", // ← Refresh Token 받기용 쿠키 설정
    });

    const accessToken = res.headers.get("access");

    if (res.ok && accessToken) {
      // 1) 토큰 저장
      localStorage.removeItem("emergencyPhone");
      localStorage.setItem("accessToken", accessToken);

      // 2) 비상연락처 API 호출 후 저장
      try {
        const { phoneNumber } = await getEmergencyContact();
        localStorage.setItem("emergencyPhone", phoneNumber);
      } catch (err) {
        console.warn("비상연락망 저장 실패:", err);
      }

      alert("로그인 성공!");
      nav("/");
    } else {
      const error = await res.json();
      alert(error.reason || "로그인 실패");
    }
  } catch (err) {
    console.error("로그인 오류:", err);
    alert("서버 오류가 발생했습니다.");
  }
};

    const nav = useNavigate();

    const [active, setActive]= useState(false);
   
    const [inputs, setInputs] = useState({
        id: '',
        pw: ''
    });

    const {id, pw} = inputs;

    const onChange = (e) => {
        const {name, value} = e.target;

        const nextInputs = {
            ...inputs,
            [name] : value,
        }
        setInputs(nextInputs);
    };

    useEffect(()=>{
        const isActive = id && pw;
        setActive(isActive);
    }, [id, pw]);

    const handleLogin = async () => {
        await login(inputs.id, inputs.pw);
    };

    return (
        <>
        <div className="wrapper">
            <div  className="header_wrapper">
                <h1>로그인을 해주세요!</h1>
                <p>체리맵만의 서비스를 만나보실 수 있어요</p>
            </div>

            <div className="main_wrapper">
                <div>
                    <form className="info_wrapper">
                    <input 
                        type="id" 
                        name="id"
                        value={id}
                        onChange={onChange}
                        placeholder="아이디를 입력해주세요"
                        
                    />
                    <input 
                        type="password"
                        name="pw"
                        value={pw}
                        onChange={onChange}
                        autoComplete="off"
                        placeholder="비밀번호를 입력해주세요" 
                        
                    />
                    </form>
                </div>

                <div className="check_wrapper">
                    
                    <input type="checkbox" className="login_checkbox"/>
                    <div className="label_box">
                        <label htmlFor="" className="check_text">로그인 상태 유지</label>
                    </div>
                    
                </div>
            </div>

                <div className="buttons_wrapper">
                    <button>아이디 찾기</button> |
                    <button>비밀번호 찾기</button> |
                    <button onClick={() => nav("/signup")}>회원가입</button>
                </div>

            </div>

            <div className="footer_wrapper">
                <button 
                    onClick={handleLogin}
                    disabled={!active}
                    className={!active ? 'ach_login_button' : 'rej_login_button'}
                >
                    로그인
                </button>
            </div>
        </>
    )
}

export default Info;