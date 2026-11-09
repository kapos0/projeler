import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { recipes as seedRecipes } from "./data/recipes";
import type { Recipe } from "./types/recipe";

type Tab = "Keşfet" | "Favoriler" | "Menüm" | "Profil";

const colors = {
  ink: "#25352E",
  muted: "#77827B",
  cream: "#F5F2EB",
  paper: "#FFFEFB",
  green: "#789B70",
  orange: "#E5A14E",
  red: "#C85D4D",
  line: "#E7E3D9",
};

function Icon({ name, size = 20, color = colors.ink }: { name: keyof typeof Ionicons.glyphMap; size?: number; color?: string }) {
  return <Ionicons name={name} size={size} color={color} />;
}

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function matchesRecipe(recipe: Recipe, query: string) {
  const search = normalizeText(query);
  if (!search) return true;
  return normalizeText(`${recipe.title} ${recipe.ingredients.join(" ")}`).includes(search);
}

function RecipeCard({ recipe, favorite, onFavorite, onOpen }: { recipe: Recipe; favorite: boolean; onFavorite: () => void; onOpen: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onOpen}>
      <View>
        <Image source={{ uri: recipe.image }} style={styles.cardImage} />
        <Pressable
          style={styles.heart}
          onPress={(event) => {
            event.stopPropagation();
            onFavorite();
          }}
          hitSlop={8}
        >
          <Icon name={favorite ? "heart" : "heart-outline"} size={18} color={favorite ? colors.red : colors.ink} />
        </Pressable>
        <View style={styles.category}><Text style={styles.categoryText}>{recipe.category}</Text></View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.meta}><Text style={styles.metaText}><Icon name="time-outline" size={13} color={colors.muted} /> {recipe.time}</Text><Text style={styles.rating}><Icon name="star" size={13} color={colors.orange} /> {recipe.rating}</Text></View>
        <Text style={styles.cardTitle} numberOfLines={2}>{recipe.title}</Text>
        <Text style={styles.author}>{recipe.author}</Text>
      </View>
    </Pressable>
  );
}

function Header({ tab, onTab, onChef, onProfile, onAuth }: { tab: Tab; onTab: (tab: Tab) => void; onChef: () => void; onProfile: () => void; onAuth: () => void }) {
  const compact = useWindowDimensions().width < 720;
  return <View style={styles.header}>
    <Pressable style={styles.brand} onPress={() => onTab("Keşfet")}><View style={styles.brandIcon}><Icon name="restaurant-outline" size={18} color={colors.paper} /></View><Text style={styles.brandText}>lezizo<Text style={styles.dot}>.</Text></Text></Pressable>
    {!compact && <View style={styles.desktopNav}>{(["Keşfet", "Favoriler", "Menüm"] as Tab[]).map((item) => <Pressable key={item} onPress={() => onTab(item)} style={[styles.navItem, tab === item && styles.navActive]}><Text style={[styles.navText, tab === item && styles.navTextActive]}>{item}</Text></Pressable>)}</View>}
    <View style={styles.headerActions}><Pressable style={styles.chefButton} onPress={onChef}><Icon name="sparkles-outline" size={16} color={colors.orange} /><Text style={styles.chefText}>AI Şef</Text></Pressable><Pressable style={styles.authButton} onPress={onAuth}><Text style={styles.authButtonText}>Giriş</Text></Pressable><Pressable style={styles.avatar} onPress={onProfile}><Icon name="person-outline" size={18} color={colors.ink} /></Pressable></View>
  </View>;
}

function Home({ recipes, query, setQuery, favorites, toggleFavorite, open, add }: { recipes: Recipe[]; query: string; setQuery: (v: string) => void; favorites: number[]; toggleFavorite: (id: number) => void; open: (r: Recipe) => void; add: () => void }) {
  const compact = useWindowDimensions().width < 720;
  const [category, setCategory] = useState("Tümü");
  const categories = useMemo(() => ["Tümü", ...new Set(recipes.map((recipe) => recipe.category))], [recipes]);
  const filtered = useMemo(
    () => recipes.filter((recipe) => (category === "Tümü" || recipe.category === category) && matchesRecipe(recipe, query)),
    [category, query, recipes],
  );
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <View style={[styles.hero, compact && styles.heroCompact]}><View style={styles.heroCopy}><View style={styles.eyebrow}><Icon name="leaf-outline" size={14} color={colors.green} /><Text style={styles.eyebrowText}>BUGÜNÜN MUTFAK İLHAMı</Text></View><Text style={[styles.heroTitle, compact && styles.heroTitleCompact]}>İyi yemek,{"\n"}<Text style={styles.heroEm}>iyi hissettirir.</Text></Text><Text style={styles.heroLead}>Aradığın lezzeti bul, kendi tarifini paylaş ve mutfağını her gün yeniden keşfet.</Text><View style={styles.search}><Icon name="search" size={20} color={colors.muted} /><TextInput value={query} onChangeText={setQuery} placeholder="Tarif veya malzeme ara..." placeholderTextColor={colors.muted} style={styles.searchInput} /></View></View><Image source={{ uri: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=85" }} style={[styles.heroImage, compact && styles.heroImageCompact]} /></View>
    <SectionTitle eyebrow="SANA ÖZEL SEÇTİK" title="Bugün mutfakta" />
    <View style={styles.grid}>{filtered.slice(0, 3).map((r) => <RecipeCard key={r.id} recipe={r} favorite={favorites.includes(r.id)} onFavorite={() => toggleFavorite(r.id)} onOpen={() => open(r)} />)}</View>
    <View><SectionTitle eyebrow="TOPLULUKTAN YENİ" title="İlham veren tarifler" /><ScrollView horizontal showsHorizontalScrollIndicator={false}>{categories.map((item) => <Pressable key={item} onPress={() => setCategory(item)} style={[styles.outline, category === item && styles.saved]}><Text style={[styles.outlineText, category === item && { color: colors.paper }]}>{item}</Text></Pressable>)}</ScrollView></View>
    <View style={styles.grid}>{filtered.slice(3).map((r) => <RecipeCard key={r.id} recipe={r} favorite={favorites.includes(r.id)} onFavorite={() => toggleFavorite(r.id)} onOpen={() => open(r)} />)}<Pressable style={styles.addCard} onPress={add}><View style={styles.addIcon}><Icon name="add" size={22} color={colors.green} /></View><Text style={styles.addTitle}>Kendi tarifini ekle</Text><Text style={styles.author}>Lezzetini herkesle paylaş</Text></Pressable></View>
    {!filtered.length && <View style={styles.empty}><Icon name="search-outline" size={32} color={colors.muted} /><Text style={styles.emptyTitle}>Tarif bulunamadı</Text><Text style={styles.pageLead}>Başka bir yemek adı, malzeme veya kategori deneyin.</Text></View>}
  </ScrollView>;
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) { return <View style={styles.sectionTitle}><Text style={styles.eyebrowText}>{eyebrow}</Text><Text style={styles.sectionHeading}>{title}</Text></View>; }

function Collection({ tab, recipes, favorites, toggleFavorite, open, menu, toggleMenu, onAuth }: { tab: Tab; recipes: Recipe[]; favorites: number[]; toggleFavorite: (id: number) => void; open: (r: Recipe) => void; menu: Record<string, number[]>; toggleMenu: (meal: string, id: number) => void; onAuth: () => void }) {
  if (tab === "Profil") return <ScrollView contentContainerStyle={styles.scroll}><View style={styles.pageHead}><View><Text style={styles.eyebrowText}>LEZİZO TOPLULUĞU</Text><Text style={styles.pageTitle}>Profil</Text><Text style={styles.pageLead}>Favorilerini ve menünü hesabında saklamak için giriş yap.</Text></View><Pressable style={styles.primary} onPress={onAuth}><Text style={styles.primaryText}>Giriş yap</Text></Pressable></View></ScrollView>;
  if (tab === "Menüm") return <ScrollView contentContainerStyle={styles.scroll}><PageHeading eyebrow="HAFTALIK PLANIN" title="Menüm" lead="Haftanın yemeklerini önceden planla, mutfakta daha az düşün." /><View style={styles.meals}>{Object.keys(menu).map((meal) => <View style={styles.meal} key={meal}><View style={styles.mealHead}><View style={[styles.mealDot, { backgroundColor: meal === "Kahvaltı" ? colors.orange : meal === "Öğle" ? colors.green : colors.red }]} /><Text style={styles.mealTitle}>{meal}</Text><Text style={styles.author}>{menu[meal].length} tarif</Text></View>{recipes.filter((r) => menu[meal].includes(r.id)).map((r) => <View style={styles.menuRow} key={r.id}><Image source={{ uri: r.image }} style={styles.menuImage} /><View style={{ flex: 1 }}><Text style={styles.menuName}>{r.title}</Text><Text style={styles.author}>{r.time}</Text></View><Pressable onPress={() => toggleMenu(meal, r.id)}><Icon name="trash-outline" size={18} color={colors.red} /></Pressable></View>)}<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.addMenuScroll}>{recipes.filter((r) => !menu[meal].includes(r.id)).map((r) => <Pressable key={r.id} style={styles.addMenu} onPress={() => toggleMenu(meal, r.id)}><Icon name="add" size={15} color={colors.green} /><Text style={styles.addMenuText}>{r.title}</Text></Pressable>)}</ScrollView></View>)}</View></ScrollView>;
  const saved = recipes.filter((r) => favorites.includes(r.id)); return <ScrollView contentContainerStyle={styles.scroll}><PageHeading eyebrow="KİŞİSEL KOLEKSİYONUN" title="Favorilerim" lead="Kalbine dokunan tarifler burada senin için saklanır." />{saved.length ? <View style={styles.grid}>{saved.map((r) => <RecipeCard key={r.id} recipe={r} favorite onFavorite={() => toggleFavorite(r.id)} onOpen={() => open(r)} />)}</View> : <EmptyState />}</ScrollView>;
}

function PageHeading({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) { return <View style={styles.pageHead}><View><Text style={styles.eyebrowText}>{eyebrow}</Text><Text style={styles.pageTitle}>{title}</Text><Text style={styles.pageLead}>{lead}</Text></View></View>; }
function EmptyState() { return <View style={styles.empty}><Icon name="heart-outline" size={32} color={colors.muted} /><Text style={styles.emptyTitle}>Henüz favorin yok</Text><Text style={styles.pageLead}>Keşfet ekranından beğendiğin tarifleri kalbine dokunarak kaydet.</Text></View>; }

function Detail({ recipe, favorite, toggle, back }: { recipe: Recipe; favorite: boolean; toggle: () => void; back: () => void }) { return <ScrollView contentContainerStyle={styles.scroll}><Pressable style={styles.back} onPress={back}><Icon name="arrow-back" size={18} /><Text style={styles.outlineText}>Tariflere dön</Text></Pressable><View style={styles.detail}><View style={{ flex: 1 }}><Image source={{ uri: recipe.image }} style={styles.detailImage} /><Pressable style={[styles.saveButton, favorite && styles.saved]} onPress={toggle}><Icon name={favorite ? "heart" : "heart-outline"} size={18} color={favorite ? colors.paper : colors.ink} /><Text style={[styles.outlineText, favorite && { color: colors.paper }]}>{favorite ? "Favorilerde" : "Favoriye ekle"}</Text></Pressable></View><View style={styles.detailCopy}><Text style={styles.eyebrowText}>{recipe.category} · {recipe.time}</Text><Text style={styles.pageTitle}>{recipe.title}</Text><Text style={styles.detailLead}>{recipe.description}</Text><Text style={styles.detailHeading}>Malzemeler</Text>{recipe.ingredients.map((item) => <View style={styles.ingredient} key={item}><View style={styles.ingredientDot} /><Text style={styles.pageLead}>{item}</Text></View>)}<Text style={styles.detailHeading}>Yapılışı</Text><Text style={styles.pageLead}>{recipe.instructions}</Text></View></View><View style={styles.nutrition}><SectionTitle eyebrow="BİR PORSİYON İÇİN" title="Besin değerleri" />{recipe.nutrition.map((item) => <View key={item.label} style={styles.nutritionRow}><View style={styles.nutritionLabel}><Text style={styles.pageLead}>{item.label}</Text><Text style={styles.outlineText}>{item.value}</Text></View><View style={styles.bar}><View style={[styles.barFill, { width: `${item.percent}%`, backgroundColor: item.color }]} /></View></View>)}</View></ScrollView>; }

function FormModal({ visible, onClose, onSubmit }: { visible: boolean; onClose: () => void; onSubmit: (recipe: Recipe) => void }) { const [title, setTitle] = useState(""); const [author, setAuthor] = useState(""); const [ingredients, setIngredients] = useState(""); const [instructions, setInstructions] = useState(""); const fields: Array<[string, string, (value: string) => void]> = [["Tarif adı", title, setTitle], ["Adın", author, setAuthor], ["Malzemeler (virgülle ayır)", ingredients, setIngredients], ["Yapılışı", instructions, setInstructions]]; return <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}><KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalBack}><View style={styles.modal}><Pressable style={styles.close} onPress={onClose}><Icon name="close" size={22} /></Pressable><Text style={styles.eyebrowText}>TOPLULUĞA KATIL</Text><Text style={styles.modalTitle}>Tarifini paylaş</Text><Text style={styles.pageLead}>Malzemeleri ve yapılışını ekle, tarifin Lezizo mutfağında görünsün.</Text>{fields.map(([label, value, setter]) => <View key={label}><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={setter} multiline={label.includes("Malz") || label.includes("Yap")} style={[styles.input, (label.includes("Malz") || label.includes("Yap")) && styles.textarea]} /></View>)}<Pressable style={styles.primary} onPress={() => { if (!title || !author || !ingredients || !instructions) return Alert.alert("Eksik bilgi", "Lütfen tüm alanları doldur."); onSubmit({ id: Date.now(), title, author, category: "Topluluktan", time: "30 dk", rating: "Yeni", image: seedRecipes[1].image, description: "Topluluğumuzdan yepyeni bir ev tarifi.", ingredients: ingredients.split(",").map((x) => x.trim()).filter(Boolean), instructions, nutrition: [] }); setTitle(""); setAuthor(""); setIngredients(""); setInstructions(""); }}><Icon name="add" size={18} color={colors.paper} /><Text style={styles.primaryText}>Tarifi yayınla</Text></Pressable></View></KeyboardAvoidingView></Modal>; }

function ChefModal({ visible, onClose }: { visible: boolean; onClose: () => void }) { const [input, setInput] = useState(""); const [messages, setMessages] = useState<string[]>([]); return <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}><KeyboardAvoidingView behavior="padding" style={styles.modalBack}><View style={styles.chefModal}><View style={styles.chefHead}><View style={styles.chefIcon}><Icon name="sparkles" size={22} color={colors.paper} /></View><View><Text style={styles.eyebrowText}>GEMINI İLE GÜÇLENDİRİLİR</Text><Text style={styles.modalTitle}>AI Şef</Text></View><Pressable onPress={onClose} style={{ marginLeft: "auto" }}><Icon name="close" size={22} /></Pressable></View><View style={styles.chat}><View style={styles.assistant}><Text style={styles.pageLead}>Merhaba! Bugün mutfakta ne var? 👋</Text></View>{messages.map((m, i) => <View style={i % 2 ? styles.assistant : styles.user} key={`${m}-${i}`}><Text style={styles.pageLead}>{m}</Text></View>)}</View><View style={styles.chatInput}><TextInput value={input} onChangeText={setInput} placeholder="Örn. nohut, ıspanak ve yoğurt..." style={styles.searchInput} /><Pressable onPress={() => { const message = input.trim(); if (!message) return; setMessages((current) => [...current, message, "Harika seçim! Biraz limon kabuğu ve taze kekik eklemeni öneririm."]); setInput(""); }}><Icon name="send" size={18} color={colors.green} /></Pressable></View></View></KeyboardAvoidingView></Modal>; }

function AuthModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const runtime = globalThis as typeof globalThis & { process?: { env?: { EXPO_PUBLIC_API_URL?: string } } };
      const baseUrl = runtime.process?.env?.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/auth/${mode === "signUp" ? "sign-up" : "sign-in"}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(mode === "signUp" ? { name, email, password } : { email, password }),
      });
      const result = (await response.json()) as { message?: string; error?: { message?: string } };
      if (!response.ok) {
        throw new Error(result.error?.message ?? result.message ?? "İşlem tamamlanamadı.");
      }
      onClose();
      Alert.alert(mode === "signUp" ? "Kayıt tamamlandı" : "Hoş geldin", mode === "signUp" ? "Hesabın oluşturuldu." : "Başarıyla giriş yaptın.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}><KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalBack}><View style={styles.modal}><Pressable style={styles.close} onPress={onClose}><Icon name="close" size={22} /></Pressable><Text style={styles.eyebrowText}>LEZİZO TOPLULUĞU</Text><Text style={styles.modalTitle}>{mode === "signUp" ? "Mutfağına katıl" : "Tekrar hoş geldin"}</Text><Text style={styles.pageLead}>{mode === "signUp" ? "Favorilerini ve menünü hesabında sakla." : "Tariflerine kaldığın yerden devam et."}</Text>{mode === "signUp" && <><Text style={styles.label}>Ad soyad</Text><TextInput value={name} onChangeText={setName} placeholder="Adın soyadın" style={styles.input} autoCapitalize="words" /></>}<Text style={styles.label}>E-posta</Text><TextInput value={email} onChangeText={setEmail} placeholder="sen@example.com" style={styles.input} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} /><Text style={styles.label}>Şifre</Text><TextInput value={password} onChangeText={setPassword} placeholder="En az 8 karakter" style={styles.input} secureTextEntry autoCapitalize="none" />{error ? <Text style={styles.authError}>{error}</Text> : null}<Pressable style={[styles.primary, loading && styles.disabled]} onPress={submit} disabled={loading}><Text style={styles.primaryText}>{loading ? "Bekleyin..." : mode === "signUp" ? "Kayıt ol" : "Giriş yap"}</Text></Pressable><Pressable onPress={() => { setMode((current) => current === "signIn" ? "signUp" : "signIn"); setError(""); }}><Text style={styles.authSwitch}>{mode === "signUp" ? "Zaten hesabın var mı? Giriş yap" : "Hesabın yok mu? Kayıt ol"}</Text></Pressable></View></KeyboardAvoidingView></Modal>;
}

export default function App() {
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState<Tab>("Keşfet"); const [query, setQuery] = useState(""); const [selected, setSelected] = useState<Recipe | null>(null); const [favorites, setFavorites] = useState<number[]>([2]); const [added, setAdded] = useState<Recipe[]>([]); const [showAdd, setShowAdd] = useState(false); const [showChef, setShowChef] = useState(false); const [showAuth, setShowAuth] = useState(false); const [menu, setMenu] = useState<Record<string, number[]>>({ Kahvaltı: [3], Öğle: [], Akşam: [1] });
  const all = useMemo(() => [...added, ...seedRecipes], [added]); const toggleFavorite = (id: number) => setFavorites((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]); const toggleMenu = (meal: string, id: number) => setMenu((current) => ({ ...current, [meal]: current[meal].includes(id) ? current[meal].filter((x) => x !== id) : [...current[meal], id] }));
  const isCompact = width < 720;
  return <SafeAreaProvider><SafeAreaView style={styles.safe} edges={["top", "left", "right"]}><StatusBar style="dark" /><View style={[styles.app, !isCompact && styles.appWide]}><Header tab={tab} onTab={(next) => { setTab(next); setSelected(null); }} onChef={() => setShowChef(true)} onProfile={() => setTab("Profil")} onAuth={() => setShowAuth(true)} />{selected ? <Detail recipe={selected} favorite={favorites.includes(selected.id)} toggle={() => toggleFavorite(selected.id)} back={() => setSelected(null)} /> : tab === "Keşfet" ? <Home recipes={all} query={query} setQuery={setQuery} favorites={favorites} toggleFavorite={toggleFavorite} open={setSelected} add={() => setShowAdd(true)} /> : <Collection tab={tab} recipes={all} favorites={favorites} toggleFavorite={toggleFavorite} open={setSelected} menu={menu} toggleMenu={toggleMenu} onAuth={() => setShowAuth(true)} />}{isCompact && <View style={styles.bottomNav}>{(["Keşfet", "Favoriler", "Menüm", "Profil"] as Tab[]).map((item) => <Pressable key={item} onPress={() => setTab(item)} style={styles.bottomItem}><Icon name={item === "Keşfet" ? "compass-outline" : item === "Favoriler" ? "heart-outline" : item === "Menüm" ? "calendar-outline" : "person-outline"} size={21} color={tab === item ? colors.green : colors.muted} /><Text style={[styles.bottomText, tab === item && { color: colors.green }]}>{item}</Text></Pressable>)}</View>}</View><FormModal visible={showAdd} onClose={() => setShowAdd(false)} onSubmit={(recipe) => { setAdded((current) => [recipe, ...current]); setShowAdd(false); }} /><ChefModal visible={showChef} onClose={() => setShowChef(false)} /><AuthModal visible={showAuth} onClose={() => setShowAuth(false)} /></SafeAreaView></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream }, app: { flex: 1 }, appWide: { maxWidth: 1320, width: "100%", alignSelf: "center" }, header: { minHeight: 76, paddingHorizontal: 22, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: colors.cream }, brand: { flexDirection: "row", alignItems: "center", gap: 9 }, brandIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: colors.green, justifyContent: "center", alignItems: "center" }, brandText: { fontSize: 24, fontWeight: "800", color: colors.ink, letterSpacing: -1 }, dot: { color: colors.orange }, desktopNav: { flexDirection: "row", gap: 8 }, navItem: { paddingVertical: 11, paddingHorizontal: 16, borderRadius: 20 }, navActive: { backgroundColor: colors.paper }, navText: { color: colors.muted, fontWeight: "600" }, navTextActive: { color: colors.ink }, headerActions: { flexDirection: "row", gap: 12, alignItems: "center" }, chefButton: { flexDirection: "row", gap: 7, alignItems: "center", padding: 10 }, chefText: { color: colors.ink, fontWeight: "700" }, avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.orange, alignItems: "center", justifyContent: "center" }, avatarText: { color: colors.paper, fontWeight: "800" }, scroll: { padding: 22, paddingBottom: 100 }, hero: { flexDirection: "row", minHeight: 360, alignItems: "center", gap: 24, maxWidth: 1100, alignSelf: "center", width: "100%" }, heroCopy: { flex: 1 }, eyebrow: { flexDirection: "row", alignItems: "center", gap: 6 }, eyebrowText: { fontSize: 11, letterSpacing: 1.4, fontWeight: "800", color: colors.green }, heroTitle: { fontSize: 48, lineHeight: 54, fontWeight: "800", color: colors.ink, marginTop: 16, letterSpacing: -1 }, heroEm: { color: colors.green, fontStyle: "italic" }, heroLead: { color: colors.muted, fontSize: 16, lineHeight: 25, maxWidth: 500, marginTop: 14 }, search: { marginTop: 22, backgroundColor: colors.paper, borderRadius: 14, paddingHorizontal: 15, height: 52, flexDirection: "row", alignItems: "center", gap: 10, maxWidth: 480 }, searchInput: { flex: 1, color: colors.ink, fontSize: 14 }, heroImage: { width: 350, height: 350, borderRadius: 175, resizeMode: "cover" }, sectionTitle: { marginTop: 28, marginBottom: 16 }, sectionHeading: { fontSize: 27, color: colors.ink, fontWeight: "800", marginTop: 5 }, grid: { flexDirection: "row", flexWrap: "wrap", gap: 16 }, card: { backgroundColor: colors.paper, borderRadius: 18, overflow: "hidden", width: 280, maxWidth: "100%", flexGrow: 1, flexBasis: 250 }, pressed: { opacity: 0.8 }, cardImage: { width: "100%", height: 190 }, heart: { position: "absolute", right: 12, top: 12, backgroundColor: colors.paper, width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" }, category: { position: "absolute", bottom: 12, left: 12, backgroundColor: colors.paper, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }, categoryText: { color: colors.ink, fontSize: 11, fontWeight: "700" }, cardBody: { padding: 15 }, meta: { flexDirection: "row", justifyContent: "space-between" }, metaText: { color: colors.muted, fontSize: 12 }, rating: { color: colors.ink, fontWeight: "700", fontSize: 12 }, cardTitle: { color: colors.ink, fontWeight: "800", fontSize: 17, marginTop: 10 }, author: { color: colors.muted, marginTop: 6, fontSize: 12 }, addCard: { flex: 1, minWidth: 220, borderRadius: 18, borderWidth: 1, borderStyle: "dashed", borderColor: colors.green, alignItems: "center", justifyContent: "center", minHeight: 285, padding: 20 }, addIcon: { width: 45, height: 45, borderRadius: 23, backgroundColor: "#E8F0E5", alignItems: "center", justifyContent: "center" }, addTitle: { color: colors.ink, fontWeight: "800", marginTop: 12 }, pageHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 25, gap: 15 }, pageTitle: { color: colors.ink, fontWeight: "800", fontSize: 36, letterSpacing: -0.5, marginTop: 6 }, pageLead: { color: colors.muted, lineHeight: 22, marginTop: 5 }, outline: { borderWidth: 1, borderColor: colors.line, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14 }, outlineText: { color: colors.ink, fontWeight: "700" }, stats: { flexDirection: "row", backgroundColor: colors.paper, borderRadius: 16, marginBottom: 20, padding: 20, gap: 38 }, stat: { flex: 1 }, statValue: { fontWeight: "800", fontSize: 27, color: colors.ink }, statLabel: { color: colors.muted, marginTop: 4, fontSize: 12 }, empty: { backgroundColor: colors.paper, borderRadius: 20, alignItems: "center", padding: 50 }, emptyTitle: { color: colors.ink, fontSize: 20, fontWeight: "800", marginTop: 12 }, meals: { flexDirection: "row", flexWrap: "wrap", gap: 16 }, meal: { backgroundColor: colors.paper, borderRadius: 16, padding: 16, flex: 1, minWidth: 270 }, mealHead: { flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 13 }, mealDot: { width: 10, height: 10, borderRadius: 5 }, mealTitle: { color: colors.ink, fontWeight: "800", fontSize: 18, flex: 1 }, menuRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.line }, menuImage: { width: 45, height: 45, borderRadius: 10 }, menuName: { color: colors.ink, fontWeight: "700", fontSize: 13 }, addMenuScroll: { marginTop: 8 }, addMenu: { flexDirection: "row", alignItems: "center", gap: 4, marginRight: 12, padding: 6, borderRadius: 8, backgroundColor: colors.cream }, addMenuText: { fontSize: 11, color: colors.ink }, back: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 20 }, detail: { flexDirection: "row", flexWrap: "wrap", gap: 28 }, detailImage: { width: "100%", height: 400, borderRadius: 20, resizeMode: "cover" }, saveButton: { marginTop: 12, borderWidth: 1, borderColor: colors.line, borderRadius: 12, padding: 12, flexDirection: "row", justifyContent: "center", gap: 8 }, saved: { backgroundColor: colors.green, borderColor: colors.green }, detailCopy: { flex: 1, minWidth: 280, paddingVertical: 4 }, detailLead: { color: colors.muted, fontSize: 16, lineHeight: 26, marginTop: 14 }, detailHeading: { color: colors.ink, fontWeight: "800", fontSize: 20, marginTop: 25, marginBottom: 10 }, ingredient: { flexDirection: "row", gap: 9, alignItems: "center", marginVertical: 4 }, ingredientDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.orange }, nutrition: { marginTop: 28, padding: 20, borderRadius: 18, backgroundColor: "#E8F0E5" }, nutritionRow: { marginTop: 13 }, nutritionLabel: { flexDirection: "row", justifyContent: "space-between" }, bar: { height: 7, borderRadius: 4, backgroundColor: colors.paper, overflow: "hidden", marginTop: 6 }, barFill: { height: "100%", borderRadius: 4 }, bottomNav: { position: "absolute", bottom: 0, left: 0, right: 0, height: 70, backgroundColor: colors.paper, borderTopWidth: 1, borderTopColor: colors.line, flexDirection: "row", justifyContent: "space-around", paddingTop: 8 }, bottomItem: { alignItems: "center", gap: 3 }, bottomText: { fontSize: 10, color: colors.muted }, modalBack: { flex: 1, backgroundColor: "rgba(37,53,46,.45)", justifyContent: "flex-end" }, modal: { backgroundColor: colors.paper, padding: 22, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "92%" }, close: { alignSelf: "flex-end", padding: 5 }, modalTitle: { color: colors.ink, fontWeight: "800", fontSize: 26, marginTop: 5 }, label: { color: colors.ink, fontWeight: "700", fontSize: 12, marginTop: 14, marginBottom: 5 }, input: { borderWidth: 1, borderColor: colors.line, borderRadius: 10, padding: 12, color: colors.ink, backgroundColor: colors.cream }, textarea: { minHeight: 78, textAlignVertical: "top" }, primary: { marginTop: 18, borderRadius: 12, padding: 14, backgroundColor: colors.green, flexDirection: "row", gap: 7, justifyContent: "center", alignItems: "center" }, primaryText: { color: colors.paper, fontWeight: "800" }, chefModal: { backgroundColor: colors.paper, padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, height: "75%" }, chefHead: { flexDirection: "row", alignItems: "center", gap: 10 }, chefIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.green, alignItems: "center", justifyContent: "center" }, chat: { flex: 1, marginTop: 18, gap: 10 }, assistant: { alignSelf: "flex-start", maxWidth: "85%", backgroundColor: colors.cream, padding: 11, borderRadius: 12 }, user: { alignSelf: "flex-end", maxWidth: "85%", backgroundColor: "#E8F0E5", padding: 11, borderRadius: 12 }, chatInput: { borderWidth: 1, borderColor: colors.line, borderRadius: 12, paddingHorizontal: 12, flexDirection: "row", alignItems: "center" },
  heroCompact: { flexDirection: "column", alignItems: "stretch", minHeight: 0 }, heroTitleCompact: { fontSize: 38, lineHeight: 43 }, heroImageCompact: { width: "100%", height: 220, borderRadius: 24, marginTop: 24 }, authButton: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.paper }, authButtonText: { color: colors.ink, fontWeight: "700" }, authError: { color: colors.red, marginTop: 8, lineHeight: 20 }, authSwitch: { color: colors.green, fontWeight: "700", textAlign: "center", marginTop: 16 }, disabled: { opacity: 0.6 },
});
