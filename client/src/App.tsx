import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import './App.css'

const GET_LOCATIONS = gql`
  query {
    announcements {
      id, title, content, categories { name }
    }
  }
`;

interface Announcement {
  id: string;
  title: string;
  content: string;
  categories: { name: string }[];
}

interface AnnouncementsData {
  announcements: Announcement[];
}

function App() {
  const { loading, error, data } = useQuery<AnnouncementsData>(GET_LOCATIONS);

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error : {error.message}</p>;
  }

  return (
    <div className="container">
      {data?.announcements.map((announcement) => (
        <div key={announcement.id} className="card">
          <h3>{announcement.title}</h3>
          <p>{announcement.content}</p>
          <div className="tags">
            {announcement.categories.map((cat) => cat.name).join(', ')}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App
