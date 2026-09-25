import { LuSignal, LuWifi, LuWifiOff, LuBatteryFull } from "react-icons/lu";
import { LogoMark } from "./Logo";

// Maqueta realista de un celular: marco metálico, isla superior, botones laterales,
// barra de estado, reflejo en el vidrio e indicador de inicio.
export default function PhoneMockup({ children, offline = false, label }) {
    return (
        <figure
            aria-label={label}
            className="relative w-[240px] h-[492px] rounded-[46px] p-[3px] bg-gradient-to-br from-[#5a5f66] via-[#1c1d20] to-[#44484e] shadow-[0_30px_60px_-15px_rgba(0,20,40,0.45),0_12px_24px_-8px_rgba(0,0,0,0.3)] transition-transform duration-500 hover:-translate-y-2"
        >
            {/* Botones laterales */}
            <span aria-hidden="true" className="absolute -left-[3px] top-[96px] w-[3px] h-[26px] rounded-l bg-[#2a2c30]" />
            <span aria-hidden="true" className="absolute -left-[3px] top-[134px] w-[3px] h-[46px] rounded-l bg-[#2a2c30]" />
            <span aria-hidden="true" className="absolute -left-[3px] top-[188px] w-[3px] h-[46px] rounded-l bg-[#2a2c30]" />
            <span aria-hidden="true" className="absolute -right-[3px] top-[150px] w-[3px] h-[70px] rounded-r bg-[#2a2c30]" />

            {/* Bisel negro */}
            <div className="h-full w-full rounded-[43px] bg-black p-[9px]">
                {/* Pantalla */}
                <div className="relative h-full w-full overflow-hidden rounded-[35px] bg-white text-left font-raleway flex flex-col">
                    {/* Isla superior */}
                    <span aria-hidden="true" className="absolute top-[9px] left-1/2 -translate-x-1/2 w-[66px] h-[21px] rounded-full bg-black z-20" />

                    {/* Barra de estado */}
                    <div aria-hidden="true" className="relative z-10 flex items-center justify-between h-[42px] pl-7 pr-5 pt-1 bg-forma-navy text-white text-[12px] font-semibold">
                        <span>9:41</span>
                        <span className="flex items-center gap-[3px] text-[12px]">
                            <LuSignal strokeWidth={2.5} />
                            {offline ? <LuWifiOff strokeWidth={2.5} /> : <LuWifi strokeWidth={2.5} />}
                            <LuBatteryFull strokeWidth={2} className="text-[16px]" />
                        </span>
                    </div>

                    {/* Barra de la app */}
                    <div className="flex items-center gap-2 px-4 pb-3 pt-1 bg-forma-navy text-white">
                        <LogoMark className="h-[20px] w-auto text-forma-cyan" />
                        <span className="font-raleway font-medium text-[18px] leading-none">FormA</span>
                    </div>

                    {/* Contenido de la pantalla */}
                    <div className="flex-1 flex flex-col px-4 pt-4 pb-7 bg-[#f7faff]">{children}</div>

                    {/* Indicador de inicio */}
                    <span aria-hidden="true" className="absolute bottom-[7px] left-1/2 -translate-x-1/2 w-[92px] h-[4px] rounded-full bg-black/80" />

                    {/* Reflejo del vidrio */}
                    <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.06)_28%,transparent_42%)]" />
                </div>
            </div>
        </figure>
    );
}
