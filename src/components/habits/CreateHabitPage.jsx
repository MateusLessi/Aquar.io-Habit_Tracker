import React, { useState } from 'react';
import {ArrowLeft, Smile, Dumbbell, Book, Coffee, Music, Code, Heart, Star, Droplet, Moon} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { useHabits } from '../../context/HabitContext';
import './CreateHabitPage.css';

const PRESET_ICONS = [
    { id: 'smile', icon: Smile },
    { id: 'dumbbell', icon: Dumbbell },
    { id: 'book', icon: Book },
    { id: 'coffee', icon: Coffee },
    { id: 'music', icon: Music },
    { id: 'code', icon: Code },
    { id: 'heart', icon: Heart },
    { id: 'star', icon: Star },
    { id: 'droplet', icon: Droplet },
    { id: 'moon', icon: Moon },
];

const PRESET_COLORS = [
    '#FF6B6B', '#FF9F43', '#FDCB6E', '#1DD1A1', '#00ACC1', 
    '#64FFDA', '#4B7BEC', '#A55EEA', '#F368E0', '#C8D6E5'
];

const CREATURES = [
    { id: 'turtle', emoji: '🐢', name: 'Tartaruga' },
    { id: 'shark', emoji: '🦈', name: 'Tubarão' },
    { id: 'crab', emoji: '🦀', name: 'Caranguejo' },
    { id: 'whale', emoji: '🐋', name: 'Baleia' },
    { id: 'fish', emoji: '🐠', name: 'Peixe Palhaço' },
    { id: 'seahorse', emoji: '🐡', name: 'Cav. Marinho' },
];

const ScrollWheel = ({ min, max, value, onChange }) => {
    const handleScroll = (e) => {
        const itemHeight = 30; // Configured in CSS
        const scrollTop = e.target.scrollTop;
        const index = Math.round(scrollTop / itemHeight);
        onChange(min + index);
    };

    return (
        <div className="scroll-wheel-container" onScroll={handleScroll}>
            <div style={{ height: '15px' }} />
            {Array.from({ length: max - min + 1 }, (_, i) => i + min).map(num => (
                <div key={num} className={`scroll-wheel-item ${value === num ? 'selected' : ''}`}>
                    {num.toString().padStart(2, '0')}
                </div>
            ))}
            <div style={{ height: '15px' }} />
        </div>
    );
};

const CreateHabitPage = () => {
    const { setActiveView } = useNavigation();
    
    // Core Form State
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('smile');
    const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

    // Interval & Advanced State
    const [frequency, setFrequency] = useState('daily');
    const [interval, setIntervalVal] = useState(1);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [useCounter, setUseCounter] = useState(false);
    const [useTimer, setUseTimer] = useState(false);

    // Turno, Lembretes & Criatura
    const [timeOfDay, setTimeOfDay] = useState('any');
    const [reminders, setReminders] = useState([
        { id: 1, time: '08:00', enabled: true },
        { id: 2, time: '14:00', enabled: false },
        { id: 3, time: '20:00', enabled: false }
    ]);
    const [creatureType, setCreatureType] = useState('turtle');
    const [creatureName, setCreatureName] = useState('');

    // Counters Details
    const [counterGoal, setCounterGoal] = useState(1);
    const [counterUnit, setCounterUnit] = useState('vez');
    const [timerDuration, setTimerDuration] = useState(10);

    const { addHabit } = useHabits();

    const handleBack = () => {
        setActiveView('dashboard');
    };

    const handleSubmit = () => {
        if (!name.trim()) {
            alert("Por favor, dê um nome ao seu hábito.");
            return;
        }

        const newHabit = {
            name,
            creatureType,
            creatureName: creatureName.trim(),
            icon: selectedIcon,
            color: selectedColor,
            frequencyType: frequency,
            frequencyInterval: interval,
            counterEnabled: useCounter,
            counterGoal: useCounter ? counterGoal : null,
            counterUnit: useCounter ? counterUnit : null,
            timerEnabled: useTimer,
            timerDuration: useTimer ? timerDuration : null,
            timeOfDay,
            reminders: reminders.filter(r => r.enabled).map(r => r.time),
            // Default legacy fields to avoid breaking HabitCard
            category: 'Geral', 
        };

        addHabit(newHabit);
        setActiveView('dashboard'); // Return home after creation
    };

    const ActiveIconComponent = PRESET_ICONS.find(i => i.id === selectedIcon)?.icon || Smile;

    return (
        <div className="create-habit-page">
            {/* --- HEADER --- */}
            <header className="create-habit-header">
                <button className="icon-btn back-btn" onClick={handleBack}>
                    <ArrowLeft size={24} />
                </button>
                <h2>Criar Hábito</h2>
                <div style={{ width: 24 }}></div> {/* Balance for flex centering */}
            </header>

            <div className="create-habit-content">
                {/* --- SECTION 0: CREATURE (Moved to top based on feedback) --- */}
                <div className="rabit-card">
                    <div className="rabit-card-header">Companheiro Marinho (Ovo)</div>
                    <div className="rabit-card-body" style={{ padding: '1.25rem 0' }}>
                        <div className="plants-list">
                            {CREATURES.map(creature => (
                                <div 
                                    key={creature.id}
                                    className={`plant-card ${creatureType === creature.id ? 'active' : ''}`} 
                                    onClick={() => setCreatureType(creature.id)}
                                >
                                    <span className="plant-emoji">{creature.emoji}</span>
                                    <span className="plant-name">{creature.name}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '1rem 1.5rem 0 1.5rem' }}>
                            <input 
                                type="text" 
                                className="habit-name-input"
                                style={{ fontSize: '0.95rem', padding: '1rem' }}
                                placeholder="Dê um apelido ao animalzinho (Opcional)"
                                value={creatureName}
                                onChange={(e) => setCreatureName(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 1: HABIT NAME --- */}
                <div className="rabit-card">
                    <div className="rabit-card-header">Nome</div>
                    <div className="rabit-card-body">
                        <input 
                            type="text" 
                            className="habit-name-input"
                            placeholder="Usar fio dental depois do almoço"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>

                {/* --- SECTION 2: ICON AND COLOR --- */}
                <div className="rabit-card">
                    <div className="rabit-card-header">Ícone e cor</div>
                    <div className="rabit-card-body">
                        <div className="icon-color-container">
                            
                            {/* Selected Icon Preview & Picker */}
                            <div className="icon-preview-area">
                                <div 
                                    className="icon-preview-circle"
                                    style={{ color: selectedColor, opacity: 0.9 }}
                                >
                                    <ActiveIconComponent size={40} />
                                </div>
                                <div className="icon-edit-badge">
                                    <span style={{ fontSize: '12px' }}>✏️</span>
                                </div>
                            </div>

                            {/* Color Selection Grid */}
                            <div className="color-selection-area">
                                <div className="color-grid">
                                    {PRESET_COLORS.map(color => (
                                        <button 
                                            key={color}
                                            type="button"
                                            className={`color-swatch ${selectedColor === color ? 'selected' : ''}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setSelectedColor(color)}
                                        />
                                    ))}
                                </div>
                                <label className="custom-color-btn">
                                    + Cor personalizada
                                    <input 
                                        type="color" 
                                        className="custom-color-input" 
                                        value={selectedColor}
                                        onChange={(e) => setSelectedColor(e.target.value)} 
                                    />
                                </label>
                            </div>
                        </div>
                        
                        {/* Fake Icon Grid (In a real app, this would open in a modal, but let's leave it inline to keep it simple or expand later) */}
                        <div className="icon-grid">
                             {PRESET_ICONS.map(i => {
                                 const IconComp = i.icon;
                                 return (
                                     <button
                                         key={i.id}
                                         type="button"
                                         className={`icon-swatch ${selectedIcon === i.id ? 'selected' : ''}`}
                                         onClick={() => setSelectedIcon(i.id)}
                                     >
                                         <IconComp size={24} />
                                     </button>
                                 );
                             })}
                        </div>
                    </div>
                </div>
                
                {/* --- SECTION 3 & 4: INTERVAL & REPETITION --- */}
                <div className="rabit-card">
                    <div className="rabit-card-header">Intervalo e repetição</div>
                    <div className="rabit-card-body">
                        <div className="interval-tabs">
                            <button type="button" className={`interval-tab ${frequency === 'daily' ? 'active' : ''}`} onClick={() => setFrequency('daily')}>Diário</button>
                            <button type="button" className={`interval-tab ${frequency === 'weekly' ? 'active' : ''}`} onClick={() => setFrequency('weekly')}>Semanal</button>
                            <button type="button" className={`interval-tab ${frequency === 'monthly' ? 'active' : ''}`} onClick={() => setFrequency('monthly')}>Mensal</button>
                        </div>
                        
                        <div className="frequency-selector-row">
                            <span>Cada:</span>
                            <ScrollWheel min={1} max={99} value={interval} onChange={setIntervalVal} />
                            <span>{frequency === 'daily' ? 'Dia(s)' : (frequency === 'weekly' ? 'Semana(s)' : 'Mês(es)')}</span>
                        </div>

                        {/* ADVANCED OPTIONS TOGGLE */}
                        <div 
                            className="advanced-divider" 
                            onClick={() => setShowAdvanced(!showAdvanced)}
                        >
                            {showAdvanced ? 'Menos opções' : 'Mais opções'}
                        </div>

                        {showAdvanced && (
                            <div className="advanced-options-container">
                                <div className="advanced-toggle-row">
                                    <span>Contador</span>
                                    <div className="toggle-container" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div 
                                            className={`toggle-switch ${useCounter ? 'active' : ''}`}
                                            onClick={() => setUseCounter(!useCounter)}
                                        />
                                    </div>
                                </div>
                                
                                {useCounter && (
                                    <div className="frequency-selector-row" style={{ marginTop: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center', gap: '20px' }}>
                                        <ScrollWheel min={1} max={99} value={counterGoal} onChange={setCounterGoal} />
                                        <select 
                                            style={{background: 'transparent', color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', outline: 'none'}}
                                            value={counterUnit}
                                            onChange={(e) => setCounterUnit(e.target.value)}
                                        >
                                            <option value="vez" style={{color: 'black'}}>Vez(es)</option>
                                            <option value="página" style={{color: 'black'}}>Página(s)</option>
                                            <option value="minuto" style={{color: 'black'}}>Minuto(s)</option>
                                            <option value="quilômetro" style={{color: 'black'}}>Quilômetro(s)</option>
                                            <option value="litro" style={{color: 'black'}}>Litro(s)</option>
                                        </select>
                                    </div>
                                )}

                                <div className="advanced-toggle-row">
                                    <span>Temporizador</span>
                                    <div className="toggle-container" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div 
                                            className={`toggle-switch ${useTimer ? 'active' : ''}`}
                                            onClick={() => setUseTimer(!useTimer)}
                                        />
                                    </div>
                                </div>

                                {useTimer && (
                                    <div className="frequency-selector-row" style={{ marginTop: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center', gap: '20px' }}>
                                        <ScrollWheel min={1} max={180} value={timerDuration} onChange={setTimerDuration} />
                                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Minutos</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* --- SECTION 5: TURNO --- */}
                <div className="rabit-card">
                    <div className="rabit-card-header">Turno</div>
                    <div className="rabit-card-body">
                        <div className="turno-grid">
                            <button type="button" className={`turno-btn ${timeOfDay === 'morning' ? 'active' : ''}`} onClick={() => setTimeOfDay('morning')}>☀️ Manhã</button>
                            <button type="button" className={`turno-btn ${timeOfDay === 'afternoon' ? 'active' : ''}`} onClick={() => setTimeOfDay('afternoon')}>🌤️ Tarde</button>
                            <button type="button" className={`turno-btn ${timeOfDay === 'night' ? 'active' : ''}`} onClick={() => setTimeOfDay('night')}>🌙 Noite</button>
                            <button type="button" className={`turno-btn ${timeOfDay === 'any' ? 'active' : ''}`} onClick={() => setTimeOfDay('any')}>🌞 Qualquer hora</button>
                        </div>
                    </div>
                </div>

                {/* --- SECTION 6: LEMBRETE --- */}
                <div className="rabit-card">
                    <div className="rabit-card-header">Lembrete</div>
                    <div className="rabit-card-body">
                        {reminders.map(rem => (
                            <div key={rem.id} className="reminder-row">
                                <div className="time-input-wrapper">
                                    <input type="time" className="time-input" value={rem.time} onChange={(e) => {
                                        setReminders(reminders.map(r => r.id === rem.id ? {...r, time: e.target.value} : r));
                                    }} />
                                    <span style={{marginLeft: '8px', color: 'rgba(255,255,255,0.3)'}}>🕒</span>
                                </div>
                                <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                                    <div 
                                        className={`toggle-switch ${rem.enabled ? 'active' : ''}`}
                                        onClick={() => setReminders(reminders.map(r => r.id === rem.id ? {...r, enabled: !r.enabled} : r))}
                                    />
                                    <button type="button" style={{background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:'1.1rem'}} onClick={() => {
                                        setReminders(reminders.filter(r => r.id !== rem.id));
                                    }}>🗑️</button>
                                </div>
                            </div>
                        ))}
                        <button type="button" className="add-reminder-btn" onClick={() => setReminders([...reminders, { id: Date.now(), time: '08:00', enabled: true }])}>
                            + Criar lembrete
                        </button>
                    </div>
                </div>
                
            </div>

            {/* --- BOTTOM ACTION BAR --- */}
            <div className="bottom-action-bar">
                <button className="btn-create-habit" onClick={handleSubmit}>
                    Criar Hábito
                </button>
            </div>
        </div>
    );
};

export default CreateHabitPage;
