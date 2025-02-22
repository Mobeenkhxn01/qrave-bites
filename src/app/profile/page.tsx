import UserForm from "@/components/layout/UserForm";
import UserTabs from "@/components/layout/UserTabs";

export default function ProfilePage() {
    return (
        <section className="py-8 relative bottom-0 mb-0 bg-white ">
            <UserTabs/>
            
            <UserForm />

        </section>
    );
}