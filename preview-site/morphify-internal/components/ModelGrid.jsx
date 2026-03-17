import ModelCard from './ModelCard'

export default function ModelGrid({ models, title }) {
  return (
    <div className="bg-[#000000] relative w-full">
      {/* Category Header - Full Width */}
      <div className="bg-[#4a4a4a] relative shrink-0 w-full">
        <div className="flex flex-row items-center justify-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-2 py-4 relative w-full">
            <div className="font-['Pretendard:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[24px] text-center text-nowrap">
              <p className="block leading-[normal] whitespace-pre">{title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-[1440px] mx-auto">
        {models.length === 0 ? (
          <div className="flex items-center justify-center py-20 w-full">
            <div className="text-white text-[24px]">No models found</div>
          </div>
        ) : (
          <div className="[flex-flow:wrap] box-border content-start flex gap-0 items-start justify-start p-0 relative shrink-0 w-[1440px]">
            {models.map((model, index) => (
              <ModelCard key={model.id} model={model} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
