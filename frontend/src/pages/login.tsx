import styles from "./login.module.css";


const Login: React.FC = () => {
    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <img src="/images/McGill.png" alt="Logo"
                className={styles.logo}
            />
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1>
                        Welcome
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your McGill email, and we'll take care of it.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login;
