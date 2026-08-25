import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/prisma";
import { authOptions } from "@/auth";
import styles from "./admin.module.css";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");
  const [
    totalUsers,
    verifiedUsers,
    adminUsers,
    totalTasks,
    completedTasks,
    inProgressTasks,
    pendingTasks,
    recentTasks,
    recentUsers,
    adminProfile,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: {
        emailVerified: true,
      },
    }),

    prisma.user.count({
      where: {
        role: "ADMIN",
      },
    }),

    prisma.task.count(),

    prisma.task.count({
      where: {
        status: "COMPLETED",
      },
    }),

    prisma.task.count({
      where: {
        status: "IN_PROGRESS",
      },
    }),

    prisma.task.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        dueDate: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    }),

    prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),

    prisma.user.findFirst({
      where: {
        role: "ADMIN",
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        name: true,
        email: true,
      },
    }),
  ]);

  const completionRate =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  const progressRate =
    totalTasks > 0
      ? Math.round((inProgressTasks / totalTasks) * 100)
      : 0;

  const pendingRate =
    totalTasks > 0
      ? Math.round((pendingTasks / totalTasks) * 100)
      : 0;

  const circleEnd = Math.min(completionRate, 100);

  const adminName = adminProfile?.name || "Administrator";
  const adminEmail = adminProfile?.email || "Admin";

  const getInitial = (name: string) => {
    return name.trim().charAt(0).toUpperCase() || "A";
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Selesai";
      case "IN_PROGRESS":
        return "Dikerjakan";
      case "PENDING":
        return "Pending";
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "High";
      case "MEDIUM":
        return "Medium";
      case "LOW":
        return "Low";
      default:
        return priority;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return styles.completed;
      case "IN_PROGRESS":
        return styles.progress;
      case "PENDING":
        return styles.pending;
      default:
        return styles.pending;
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return styles.high;
      case "MEDIUM":
        return styles.medium;
      case "LOW":
        return styles.low;
      default:
        return styles.low;
    }
  };

  return (
    <main className={styles.dashboard}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>✓</div>

          <div>
            <h1>TaskMate</h1>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav className={styles.navigation}>
          <p className={styles.sectionTitle}>MAIN</p>

          <Link
            href="/admin"
            className={`${styles.navItem} ${styles.active}`}
          >
            <span>▦</span>
            Dashboard
          </Link>

          <Link href="/admin/users" className={styles.navItem}>
            <span>◉</span>
            Users
          </Link>

          <Link href="/admin/tasks" className={styles.navItem}>
            <span>✓</span>
            Tasks
          </Link>

          <p className={styles.sectionTitle}>MANAGEMENT</p>

          <Link href="/admin/categories" className={styles.navItem}>
            <span>▤</span>
            Categories
          </Link>

          <Link href="/admin/settings" className={styles.navItem}>
            <span>⚙</span>
            Settings
          </Link>
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.adminProfile}>
            <div className={styles.avatar}>
              {getInitial(adminName)}
            </div>

            <div>
              <strong>{adminName}</strong>
              <span>{adminEmail}</span>
            </div>
          </div>

          <button className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <section className={styles.main}>
        {/* HEADER */}
        <header className={styles.header}>
          <div>
            <p className={styles.breadcrumb}>Admin / Dashboard</p>

            <h2>Dashboard</h2>

            <p className={styles.subtitle}>
              Kelola dan pantau aktivitas TaskMate
            </p>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.iconButton} aria-label="Notifikasi">
              🔔
            </button>

            <div className={styles.headerProfile}>
              <div className={styles.avatar}>
                {getInitial(adminName)}
              </div>

              <div>
                <strong>{adminName}</strong>
                <span>Administrator</span>
              </div>

              <span className={styles.arrow}>⌄</span>
            </div>
          </div>
        </header>

        {/* STATS */}
        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={styles.statIcon}>👥</div>
              <span className={styles.statChange}>Users</span>
            </div>

            <p>Total Users</p>

            <h3>{totalUsers}</h3>

            <span className={styles.statDescription}>
              Semua pengguna terdaftar
            </span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={styles.statIcon}>✓</div>
              <span className={styles.statChange}>Tasks</span>
            </div>

            <p>Total Tasks</p>

            <h3>{totalTasks}</h3>

            <span className={styles.statDescription}>
              Semua task di sistem
            </span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={styles.statIcon}>✅</div>
              <span className={styles.statChange}>
                {completionRate}%
              </span>
            </div>

            <p>Completed</p>

            <h3>{completedTasks}</h3>

            <span className={styles.statDescription}>
              Task yang telah selesai
            </span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statTop}>
              <div className={styles.statIcon}>⏳</div>
              <span className={styles.statChange}>
                {pendingRate}%
              </span>
            </div>

            <p>Pending</p>

            <h3>{pendingTasks}</h3>

            <span className={styles.statDescription}>
              Menunggu dikerjakan
            </span>
          </div>
        </section>

        {/* CONTENT */}
        <div className={styles.contentGrid}>
          {/* RECENT TASKS */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h3>Recent Tasks</h3>
                <p>Task terbaru yang dibuat pengguna</p>
              </div>

              <Link href="/admin/tasks" className={styles.viewAll}>
                Lihat semua
              </Link>
            </div>

            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>User</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                  </tr>
                </thead>

                <tbody>
                  {recentTasks.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <strong>{task.title}</strong>
                      </td>

                      <td>{task.user.name}</td>

                      <td>
                        {task.category?.name || "-"}
                      </td>

                      <td>
                        <span
                          className={`${styles.status} ${getStatusClass(
                            task.status
                          )}`}
                        >
                          {getStatusLabel(task.status)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`${styles.priority} ${getPriorityClass(
                            task.priority
                          )}`}
                        >
                          {getPriorityLabel(task.priority)}
                        </span>
                      </td>

                      <td>{formatDate(task.dueDate)}</td>
                    </tr>
                  ))}

                  {recentTasks.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          textAlign: "center",
                          padding: "30px 8px",
                        }}
                      >
                        Belum ada task.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* OVERVIEW */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h3>Task Overview</h3>
                <p>Distribusi status task</p>
              </div>
            </div>

            <div className={styles.overview}>
              <div
                className={styles.progressCircle}
                style={{
                  background: `conic-gradient(
                    #2563eb 0 ${circleEnd}%,
                    #e5e7eb ${circleEnd}% 100%
                  )`,
                }}
              >
                <div>
                  <strong>{completionRate}%</strong>
                  <span>Completed</span>
                </div>
              </div>

              <div className={styles.legend}>
                <div>
                  <span
                    className={`${styles.dot} ${styles.dotCompleted}`}
                  />
                  <span>Completed</span>
                  <strong>{completedTasks}</strong>
                </div>

                <div>
                  <span
                    className={`${styles.dot} ${styles.dotProgress}`}
                  />
                  <span>In Progress</span>
                  <strong>{inProgressTasks}</strong>
                </div>

                <div>
                  <span
                    className={`${styles.dot} ${styles.dotPending}`}
                  />
                  <span>Pending</span>
                  <strong>{pendingTasks}</strong>
                </div>

                <div>
                  <span
                    style={{
                      gridColumn: "2 / 3",
                      fontSize: "9px",
                      color: "#94a3b8",
                    }}
                  >
                    Progress
                  </span>

                  <strong>{progressRate}%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* USERS */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h3>User Terbaru</h3>
              <p>Pengguna yang paling baru terdaftar</p>
            </div>

            <Link href="/admin/users" className={styles.viewAll}>
              Lihat semua
            </Link>
          </div>

          <div className={styles.usersGrid}>
            {recentUsers.map((user) => (
              <div key={user.id} className={styles.userCard}>
                <div className={styles.userAvatar}>
                  {getInitial(user.name)}
                </div>

                <div className={styles.userInfo}>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>

                <span className={styles.role}>
                  {user.role}
                </span>
              </div>
            ))}

            {recentUsers.length === 0 && (
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "11px",
                }}
              >
                Belum ada user.
              </p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <span>TaskMate Admin Panel</span>
          <span>Data diperbarui langsung dari database</span>
        </footer>
      </section>
    </main>
  );
}