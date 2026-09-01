function PlatformSelector({ platform, setPlatform }) {
  return (
    <select
      value={platform}
      onChange={(e) => setPlatform(e.target.value)}
    >
      <option>Facebook</option>
      <option>Instagram</option>
      <option>LinkedIn</option>
      <option>Twitter</option>
    </select>
  );
}

export default PlatformSelector;