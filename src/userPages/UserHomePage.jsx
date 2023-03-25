import { useQuery } from "react-query"
import { fetchGroupPerUserId } from "../../Utils/Queries"
import { returnSessionObject } from "../../Utils/Utils"
import {CreateGroupModal} from "../assets/CreateGroupModal.jsx"
import { JoinGroupModal } from "../assets/JoinGroupModal"
import { useState } from "react"


const UserHomePage = () => {
  const [groups, setGroups] = useState([])
  const {isLoading,error,data} = useQuery('groups',() => fetchGroupPerUserId(returnSessionObject().id),{
    onSuccess: (data) => {
      setGroups(data.group)
    }
  })
  if (error) return <p>error</p>
  if (isLoading) return <p>loading</p>
  return (
    <div>
      UserHomePage
      <br/>
      this page will only be accessible once user logs in.
      <br/>
      This page will contain all the groups as well as the next upcoming meetup (also if there are any meetups they haven't given availabilities for then it will show)
      <br/>
      create a group:
      <CreateGroupModal groups={groups} setGroups={setGroups}></CreateGroupModal>
      <br/>
      join a group:
      <JoinGroupModal></JoinGroupModal>
      <br/>
      your groups:

      {groups.map((group,i) => {
        return (
          <div key={i}>
            <p>{group.groupName}</p>
          </div>
        )
      })}
      
    </div>
  )
  }

export default UserHomePage