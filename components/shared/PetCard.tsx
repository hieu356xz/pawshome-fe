interface PetCardProps {
  name: string;
  ageGroup: string;
  breed: string;
  species: string;
  gender: string;
  adoptionStatus: string;
  imageUrl?: string;
}

export function PetCard({ name, ageGroup, breed, species, gender, adoptionStatus, imageUrl }: PetCardProps) {
  return (
    <div className="group relative flex flex-col items-center">
      <div className="aspect-[3/4] w-full rounded-2xl bg-muted overflow-hidden border border-border shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full bg-primary/5 flex items-center justify-center font-serif text-primary/20 text-4xl">
            {name[0]}
          </div>
        )}
        
        {/* Adoption Status Badge */}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm z-20">
          {adoptionStatus.replace('_', ' ')}
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-white">
          <p className="font-serif text-2xl font-bold">{name}, {ageGroup.toLowerCase()}</p>
          <p className="text-sm opacity-90 font-medium tracking-wide">{breed}</p>
          <button className="mt-4 w-full bg-accent text-accent-foreground py-2 rounded-lg text-sm font-bold shadow-lg transform active:scale-95 transition-transform">
            View Profile
          </button>
        </div>
      </div>
      
      {/* Static Info (Visible when not hovered) */}
      <div className="mt-5 text-center group-hover:opacity-0 transition-opacity">
        <h4 className="font-serif text-xl font-bold text-foreground">{name}</h4>
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest mt-1">
          {species} • {gender} • {ageGroup}
        </p>
      </div>
    </div>
  );
}
