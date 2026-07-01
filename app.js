document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. Interactive Auditor (자가 진단기)
     ========================================== */
  let currentStep = 1;
  const totalSteps = 3;
  
  const qSteps = [
    document.getElementById('q-step-1'),
    document.getElementById('q-step-2'),
    document.getElementById('q-step-3')
  ];
  
  const prevBtn = document.getElementById('audit-prev-btn');
  const nextBtn = document.getElementById('audit-next-btn');
  const progressFill = document.getElementById('audit-progress-fill');
  const progressText = document.getElementById('audit-progress-text');
  
  const auditBox = document.getElementById('audit-box');
  const resultBox = document.getElementById('audit-result-box');
  const scoreNum = document.getElementById('audit-score-num');
  const riskBadge = document.getElementById('audit-risk-badge');
  const problemDesc = document.getElementById('audit-problem-desc');
  const solutionDesc = document.getElementById('audit-solution-desc');
  const restartBtn = document.getElementById('restart-audit-btn');

  function updateAuditProgress() {
    const percentage = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${currentStep}단계 / ${totalSteps}단계`;
    
    // Prev button visibility
    if (currentStep === 1) {
      prevBtn.classList.add('hidden');
    } else {
      prevBtn.classList.remove('hidden');
    }
    
    // Next/Submit text
    if (currentStep === totalSteps) {
      nextBtn.textContent = '진단 완료 및 결과 보기';
    } else {
      nextBtn.textContent = '다음 단계';
    }
  }

  function showStep(step) {
    qSteps.forEach((el, index) => {
      if (index === step - 1) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });
    updateAuditProgress();
  }

  nextBtn.addEventListener('click', () => {
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    } else {
      // Calculate results
      calculateAuditResults();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  });

  function calculateAuditResults() {
    const q1Val = document.querySelector('input[name="q1"]:checked').value;
    const q2Val = document.querySelector('input[name="q2"]:checked').value;
    const q3Val = document.querySelector('input[name="q3"]:checked').value;
    
    let score = 0;
    let problems = [];
    let solutions = [];
    
    // Question 1 mapping
    if (q1Val === 'google-docs') {
      score += 25;
      problems.push("Google Docs 출력 방식은 폰트 파일이 PDF 내부에 불완전하게 포함(Embedding)되어, 모바일 뷰어나 타 OS 기기에서 레이아웃이 찌그러지거나 글자가 굴림체 등으로 강제 치환될 우려가 있습니다.");
      solutions.push("Adobe Acrobat Pro 등을 이용해 글꼴 속성 내 '하위 집합 포함' 여부를 강제로 확인하고, Noto Sans KR 서체 등으로 단순화하여 렌더링 무결성을 다져야 합니다.");
    } else if (q1Val === 'ms-word-low') {
      score += 10;
      problems.push("MS Word의 '최소 크기' 내보내기는 압축률이 극도로 올라가 인포그래픽, 도표, 캡처 이미지의 해상도가 심각하게 뭉개집니다. 독자에게 조악한 상품을 구매했다는 부정적인 브랜드 인식을 남기게 됩니다.");
      solutions.push("Export 설정을 '표준'으로 전환하고 파일 크기 이슈는 ExportPilot의 백엔드 이원화(클라우드 배송)를 적용해 품질을 300 DPI 이상으로 고정하십시오.");
    } else if (q1Val === 'canva-print') {
      score += 20;
      problems.push("Canva PDF 인쇄(고품질) 방식은 이미지 품질이 우수하지만, 쓸데없는 메타데이터와 중복 글꼴 레이어로 인해 파일 용량이 기하급수적으로 커져(기본 30~50MB 이상) 플랫폼 다운로드 오류를 일으킵니다.");
      solutions.push("Canva에서는 인쇄 고품질 원본을 출력하여 분산 스토리지에 따로 업로드하고, 판매처에는 150 DPI 규격으로 컴팩트화된 웰컴 가이드(5MB 이하)를 등록하는 파이프라인이 필요합니다.");
    } else if (q1Val === 'custom-fonts') {
      score += 15;
      problems.push("개인 소장용 서체 및 유료 라이선스 확인이 안 된 글꼴이 문서에 내장된 채 유통되면, 상용 플랫폼의 자동 인쇄/워터마크 스크립트 실행 과정에서 저작권 위반 법적 경고를 받거나 수천만 원의 소송 리스크가 있습니다.");
      solutions.push("구글 Montserrat, Noto Sans 등 모바일 환경 100% 호환 및 상업적 무료 라이선스가 확실한 오픈소스 폰트로 글꼴을 통일하여 출시하십시오.");
    }

    // Question 2 mapping
    if (q2Val === 'under-150-10mb') {
      score += 25;
      problems.push("150 DPI 수준으로 압축된 10MB 미만의 파일은 다운로드 속도는 안전하나, 고가의 마스터클래스나 시각 인포그래픽이 포함된 상품인 경우 프리미엄 느낌이 떨어지며 전환율과 가격 방어가 무너집니다.");
      solutions.push("텍스트 중심 장표는 150 DPI로 충분하나, 다채로운 예제가 포함된다면 이미지별로 선택적 해상도(300 DPI)를 주어야 합니다.");
    } else if (q2Val === 'over-300-20mb') {
      score += 10;
      problems.push("20MB를 초과하는 고화질 원본은 해외 독자나 모바일 데이터 환경에서 다운로드 속도가 30초 이상 지연될 경우, 판매 플랫폼 서버가 연결을 강제 타임아웃하여 다운로드 에러 문의 및 환불 신청률이 급격히 증가합니다.");
      solutions.push("5MB 내외의 가벼운 '가이드 가이드'를 플랫폼에 등록하고, 그 내부에 AWS S3 보안 클라우드 고속 링크를 삽입하는 'Dynamic Asset Delivery'가 필수적입니다.");
    } else if (q2Val === 'no-compress-high') {
      score += 5;
      problems.push("DPI 사양을 확인해보지 않았다면 90% 확률로 폰트 라이선스 불일치, 불필요한 고해상도 리소스에 의한 용량 누적 등으로 인해 출시 즉시 기술적 사고가 발생할 위험이 있습니다.");
      solutions.push("반드시 배포 전 15분 체크리스트(DPI 등 규격 분석) 및 ExportPilot 기술 검수를 먼저 진행하시길 권장합니다.");
    }

    // Question 3 mapping
    if (q3Val === 'no-version-name') {
      score += 15;
      problems.push("파일명에 버전 표기를 지워버리면 브랜딩은 깔끔하지만, 정기 업데이트 시점에 기존 구매자들이 '내가 가진 파일이 최신 버전이 맞나?' 확인을 못 해 고객 지원 채널에 하루 수십 건의 중복 CS가 쏟아져 들어옵니다.");
      solutions.push("파일명은 Ebook.pdf로 고정하되, 파일 내부 서론/판권에 인앱 버전 마크(v1.2)와 업데이트 로그 노션 링크를 노출하는 '노출 분리(Decoupling)' 방식을 도입하세요.");
    } else if (q3Val === 'version-filename') {
      score += 10;
      problems.push("파일명에 날짜와 버전 정보(v2_final_수정)를 달아두는 경우, 1인 CS 관리는 쉬울 수 있으나 다운로드 받는 구매자 입장에서는 조잡하고 완성도가 떨어지는 상품을 구매했다는 비전문적인 인상을 주게 됩니다.");
      solutions.push("고객이 다운로드하는 최종 파일명은 정제된 영문 제품명으로 깔끔히 단일화하고, 파일 내부에 마스터 노션 허브를 삽입하여 업데이트를 인앱에서 알리도록 하세요.");
    } else if (q3Val === 'decouple-pilot') {
      score += 45;
      solutions.push("훌륭합니다! 이미 파일명 분리 및 노션 허브 링크를 통해 이원화 배송 모델을 구축하셨습니다. 추가적인 클라우드 자동화 최적화를 통해 운영 효율을 극대화하실 수 있습니다.");
    }

    // Determine Risk level
    let riskText = '보안 우수';
    let riskClass = 'green';
    
    if (score < 40) {
      riskText = '심각한 위험';
      riskClass = 'red';
    } else if (score < 75) {
      riskText = '경계 필요';
      riskClass = 'yellow';
    }

    // Render output
    scoreNum.textContent = `${score} / 100`;
    riskBadge.textContent = riskText;
    riskBadge.className = `risk-badge ${riskClass}`;
    
    // Problems HTML joint
    if (problems.length > 0) {
      problemDesc.innerHTML = problems.map(p => `• ${p}`).join('<br><br>');
    } else {
      problemDesc.textContent = "발견된 치명적인 취약점이 없습니다! 현재 설정을 안정적으로 유지하셔도 좋습니다.";
    }
    
    // Solutions HTML joint
    solutionDesc.innerHTML = solutions.map(s => `• ${s}`).join('<br><br>');

    // Transition view
    auditBox.classList.add('hidden');
    resultBox.classList.remove('hidden');
  }

  restartBtn.addEventListener('click', () => {
    currentStep = 1;
    // reset radios
    document.querySelector('input[name="q1"][value="google-docs"]').checked = true;
    document.querySelector('input[name="q2"][value="under-150-10mb"]').checked = true;
    document.querySelector('input[name="q3"][value="no-version-name"]').checked = true;
    
    resultBox.classList.add('hidden');
    auditBox.classList.remove('hidden');
    showStep(currentStep);
  });

  // Init Step UI
  updateAuditProgress();


  /* ==========================================
     2. Interactive Simulator (이원화 전송 시뮬레이터)
     ========================================== */
  const sizeBtns = document.querySelectorAll('.size-btn');
  const methodBtns = document.querySelectorAll('.method-btn');
  const startSimBtn = document.getElementById('start-sim-btn');
  const particle = document.getElementById('particle');
  const transmissionRoad = document.querySelector('.transmission-road');
  
  const simProgressBar = document.getElementById('sim-progress-bar');
  const simIndicator = document.getElementById('sim-indicator');
  const simStatusMsg = document.getElementById('sim-status-msg');
  const simDisplaySize = document.getElementById('sim-display-size');
  const simResultText = document.getElementById('sim-result-text');
  
  const simReport = document.getElementById('sim-report');
  const simReportDesc = document.getElementById('sim-report-desc');
  
  let selectedSize = 5; // Default 5MB
  let selectedMethod = 'standard'; // Default standard
  let simInterval = null;

  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = parseInt(btn.getAttribute('data-size'));
      simDisplaySize.textContent = `${selectedSize}MB`;
    });
  });

  methodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      methodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedMethod = btn.getAttribute('data-method');
    });
  });

  startSimBtn.addEventListener('click', () => {
    // Clear any active simulations
    if (simInterval) clearInterval(simInterval);
    
    // UI Init for simulation
    startSimBtn.disabled = true;
    startSimBtn.textContent = '시뮬레이션 전송 중...';
    simProgressBar.style.width = '0%';
    simIndicator.className = 'status-dot blue';
    simStatusMsg.textContent = '다운로드 연결 중...';
    simResultText.textContent = '전송 중';
    simResultText.className = 'text-blue';
    
    // Start road animation
    transmissionRoad.classList.add('transmission-active');
    
    let progress = 0;
    let speed = 2; // Speed step
    
    if (selectedMethod === 'exportpilot') {
      // ExportPilot is always very fast because files size is capped to 3MB welcome guide
      speed = 10;
    } else {
      // Standard method changes speed based on file size
      if (selectedSize === 5) speed = 5;
      else if (selectedSize === 25) speed = 2.5;
      else if (selectedSize === 60) speed = 1.2;
    }

    simInterval = setInterval(() => {
      progress += speed + (Math.random() * 2 - 1);
      
      // Standard high capacity fails at around 70% due to timeout simulated
      if (selectedMethod === 'standard' && selectedSize === 60 && progress >= 68) {
        clearInterval(simInterval);
        progress = 70;
        simProgressBar.style.width = '70%';
        simProgressBar.style.backgroundColor = 'var(--danger-color)';
        
        simIndicator.className = 'status-dot red';
        simStatusMsg.textContent = '오류: 504 Gateway Timeout (다운로드 지연 중단)';
        simResultText.textContent = '전송 실패 (시간초과)';
        simResultText.className = 'text-red';
        
        transmissionRoad.classList.remove('transmission-active');
        startSimBtn.disabled = false;
        startSimBtn.textContent = '시뮬레이션 전송 시작';
        
        // Update report
        simReport.style.borderLeftColor = 'var(--danger-color)';
        simReport.style.backgroundColor = 'rgba(239, 68, 68, 0.04)';
        simReportDesc.innerHTML = `<strong>결과 분석:</strong> 60MB의 고화질 원본 파일을 결제 플랫폼 서버에서 다이렉트로 전송하면, 모바일 네트워크의 불안정한 대역폭 하에서 다운로드 속도가 30초 한계를 초과하여 서버 연결이 끊어집니다. <strong>구매자는 다운로드 도중 에러를 겪고 환불을 요청하거나 고객 문의를 발송할 확률이 85%를 넘습니다.</strong>`;
        return;
      }

      if (progress >= 100) {
        clearInterval(simInterval);
        simProgressBar.style.width = '100%';
        simIndicator.className = 'status-dot green';
        simStatusMsg.textContent = '다운로드 완수!';
        simResultText.textContent = '전송 완료';
        simResultText.className = 'text-green';
        
        transmissionRoad.classList.remove('transmission-active');
        startSimBtn.disabled = false;
        startSimBtn.textContent = '시뮬레이션 전송 시작';
        
        // Report update based on options
        if (selectedMethod === 'exportpilot') {
          simReport.style.borderLeftColor = 'var(--accent-color)';
          simReport.style.backgroundColor = 'rgba(16, 185, 129, 0.04)';
          simReportDesc.innerHTML = `<strong>결과 분석:</strong> ExportPilot의 분산 배송 기술을 사용하면, 실제 Gumroad/Shopify에는 오직 3MB의 컴팩트한 안내 가이드만 전송되므로 <strong>0.5초 만에 결제 완료 즉시 다운로드가 안전하게 끝납니다.</strong> 고해상도 원본(최대 100MB 이상 가능)은 환영장 내부 링크를 타서 AWS 고속 CDN 및 마스터 노션 허브를 통해 분산 보관되므로 끊김 리스크가 0%입니다.`;
        } else {
          // Standard successful but slow
          if (selectedSize === 5) {
            simReport.style.borderLeftColor = 'var(--primary-color)';
            simReport.style.backgroundColor = 'rgba(37, 99, 235, 0.04)';
            simReportDesc.innerHTML = `<strong>결과 분석:</strong> 5MB 저용량 텍스트 중심 파일은 일반 전송 모드로도 비교적 원활하게 성공합니다. 그러나 이북 내에 <strong>시각적 인포그래픽, 실습 표, 다이어그램, 캡처본이 누락되어 있어 높은 고부가가치 가격(예: 3만원 이상)을 책정하기 어렵고 퀄리티에 대한 지적을 받을 우려가 존재합니다.</strong>`;
          } else {
            // 25MB standard
            simReport.style.borderLeftColor = 'var(--warning-color)';
            simReport.style.backgroundColor = 'rgba(245, 158, 11, 0.04)';
            simReportDesc.innerHTML = `<strong>결과 분석:</strong> 25MB 파일 전송에 간신히 성공했습니다만, <strong>네트워크 상태가 안 좋은 일부 모바일 기기 사용자들에게는 속도 저하를 야기합니다.</strong> 파일의 압축 손실로 인포그래픽의 해상도가 타협되어 있으며, 조금만 더 콘텐츠가 추가되어 30MB 이상으로 확장되면 곧바로 타임아웃 오류 영역에 진입하게 됩니다.`;
          }
        }
      } else {
        simProgressBar.style.width = `${progress}%`;
        simStatusMsg.textContent = `다운로드 중... (${Math.round(progress)}%)`;
      }
    }, 100);
  });


  /* ==========================================
     3. Waitlist Form & Modal Handling
     ========================================== */
  const waitlistForm = document.getElementById('waitlist-form');
  const successModal = document.getElementById('success-modal');
  const closeModalX = document.querySelector('.close-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  if (waitlistForm && successModal) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulating successful submit
      successModal.classList.remove('hidden');
      waitlistForm.reset();
    });

    const hideModal = () => {
      successModal.classList.add('hidden');
    };

    closeModalX.addEventListener('click', hideModal);
    closeModalBtn.addEventListener('click', hideModal);
    
    // Close modal when clicking outside content
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        hideModal();
      }
    });
  }


  /* ==========================================
     4. FAQ Accordion (아코디언 토글)
     ========================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

});
