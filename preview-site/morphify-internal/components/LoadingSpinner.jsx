export default function LoadingSpinner({ label = 'Loading Models..' }) {
  return (
    <div className="bg-[#000000] w-full">
      {/* Placeholder for category header height */}
      <div className="bg-[#4a4a4a] h-[56px] w-full" />
      <div className="flex flex-col items-center justify-center py-20 w-full gap-6">
        <svg width="60" height="60" fill="#2B2B2B" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4" cy="12" r="3">
            <animate
              id="spinner_qFRN"
              begin="0;spinner_OcgL.end+0.25s"
              attributeName="cy"
              calcMode="spline"
              dur="0.6s"
              values="12;6;12"
              keySplines=".33,.66,.66,1;.33,0,.66,.33"
            />
          </circle>
          <circle cx="12" cy="12" r="3">
            <animate
              begin="spinner_qFRN.begin+0.1s"
              attributeName="cy"
              calcMode="spline"
              dur="0.6s"
              values="12;6;12"
              keySplines=".33,.66,.66,1;.33,0,.66,.33"
            />
          </circle>
          <circle cx="20" cy="12" r="3">
            <animate
              id="spinner_OcgL"
              begin="spinner_qFRN.begin+0.2s"
              attributeName="cy"
              calcMode="spline"
              dur="0.6s"
              values="12;6;12"
              keySplines=".33,.66,.66,1;.33,0,.66,.33"
            />
          </circle>
        </svg>
        <div className="text-white text-[24px]">{label}</div>
      </div>
    </div>
  )
}
