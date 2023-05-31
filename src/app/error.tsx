"use client"

export default function ErrorWrapper({error}: {error: Error}) {
  return <h1>Ooops!!! Main{error.message}</h1>
}